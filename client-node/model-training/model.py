import pandas as pd
import torch
import torch.nn as nn
import torch.onnx
import matplotlib.pyplot as plt

# Load and prepare data
data = pd.read_csv('../trial-data/data.csv')
data.dropna(inplace=True)

x = torch.tensor(data.x[0:175].values, dtype=torch.float32).view(-1, 1)
y = torch.tensor(data.y[0:175].values, dtype=torch.float32).view(-1, 1)

# Define PyTorch model
class LinearRegressionTorch(nn.Module):
    def __init__(self):
        super(LinearRegressionTorch, self).__init__()
        self.linear = nn.Linear(1, 1)  # y = mx + c

    def forward(self, x):
        return self.linear(x)

# Initialize model
model = LinearRegressionTorch()

# Define loss and optimizer
criterion = nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.0001)

# Train
for epoch in range(10):
    y_pred = model(x)
    loss = criterion(y_pred, y)

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    print(f"Epoch {epoch+1}, Loss: {int(loss.item() * 1000)}")

# Plot the results
plt.scatter(x.numpy(), y.numpy(), color='blue', label='Data points')
with torch.no_grad():
    y_pred = model(x)
plt.plot(x.numpy(), y_pred.numpy(), color='red', label='Regression line')
plt.xlabel('Input')
plt.ylabel('Output')
plt.title('Linear Regression')
plt.legend()
plt.show()

# Export to ONNX
# Create dummy input tensor with shape (100,1) for ONNX export
# This represents a batch of 100 samples, each with 1 feature
# The values are randomly sampled from a normal distribution
dummy_input = torch.randn(100, 1)
torch.onnx.export(
    model,
    dummy_input,
    "linear_regression.onnx",
    input_names=["input"],
    output_names=["output"],
    dynamic_axes={"input": {0: "batch_size"}, "output": {0: "batch_size"}},
    opset_version=11
)

print("✅ Exported model to linear_regression.onnx")

weights = model.linear.weight.data
bias = model.linear.bias.data

for name, param in model.named_parameters():
    if param.requires_grad:
        print(name, param.data)