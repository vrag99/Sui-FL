import os
import sys
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import rsa

def generate_large_prime(bit_length):
    return rsa.generate_private_key(public_exponent=65537, key_size=bit_length, backend=default_backend()).private_numbers().p

class PedersonCommitment:
    def __init__(self, security=1024):
        self.p = generate_large_prime(security)
        self.q = generate_large_prime(security * 2)
        self.g = int.from_bytes(os.urandom(32), 'big') % self.q
        self.s = int.from_bytes(os.urandom(32), 'big') % self.q
        self.h = pow(self.g, self.s, self.q)

    def commit(self, x):
        r = int.from_bytes(os.urandom(32), 'big') % self.q
        c = (pow(self.g, x, self.q) * pow(self.h, r, self.q)) % self.q
        return c, r

    def verify(self, c, x, r):
        return c == (pow(self.g, x, self.q) * pow(self.h, r, self.q)) % self.q

    def add_commitments(self, c1, c2):
        return (c1 * c2) % self.q

# Initialize the commitment scheme
commitment = PedersonCommitment()

def encrypt_cost(cost):
    # Assuming cost is an integer
    cost_int = int(cost)
    c, r = commitment.commit(cost_int)
    print(f"Encrypted cost: {c}")
    sys.stdout.flush()
    return c, r

def aggregate_commitments(commitments):
    result = 1
    for c in commitments:
        result = commitment.add_commitments(result, c)
    return result


if __name__ == '__main__':
    globals()[sys.argv[1]](sys.argv[2])