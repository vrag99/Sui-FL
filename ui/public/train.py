import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
import onnx
import onnxruntime as ort
import numpy as np

# Load data
data = pd.read_csv("data.csv")
data.dropna(inplace=True)
x = torch.tensor(data.x[0:175].values, dtype=torch.float32).view(-1, 1)
y = torch.tensor(data.y[0:175].values, dtype=torch.float32).view(-1, 1)

# Check for NaNs in data
assert not torch.isnan(x).any(), "Input has NaNs"
assert not torch.isnan(y).any(), "Output has NaNs"

# Load ONNX model
onnx_model_path = "model.onnx"
onnx_model = onnx.load(onnx_model_path)
onnx.checker.check_model(onnx_model)

# Extract weights and bias
initializers = {i.name: onnx.numpy_helper.to_array(i) for i in onnx_model.graph.initializer}
weight = initializers.get("linear.weight")  # shape: (1, 1)
bias = initializers.get("linear.bias")      # shape: (1,)
if weight is None or bias is None:
    raise ValueError("Could not find 'linear.weight' or 'linear.bias' in ONNX model.")

# Define PyTorch model
class LinearRegressionTorch(nn.Module):
    def __init__(self):
        super(LinearRegressionTorch, self).__init__()
        self.linear = nn.Linear(1, 1)

    def forward(self, x):
        return self.linear(x)

# Instantiate and load parameters
model = LinearRegressionTorch()
with torch.no_grad():
    model.linear.weight.copy_(torch.tensor(weight))
    model.linear.bias.copy_(torch.tensor(bias))

# Define loss and optimizer
criterion = nn.MSELoss()
optimizer = optim.SGD(model.parameters(), lr=1e-5)

# Train model
for epoch in range(10):
    model.train()
    y_pred = model(x)
    loss = criterion(y_pred, y)

    if torch.isnan(loss):
        raise ValueError("Loss is NaN. Check data or model initialization.")

    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    print(f"Epoch {epoch + 1}, Loss: {loss.item():.6f}")

# Output final parameters
with torch.no_grad():
    final_weight = model.linear.weight.data.clone()
    final_bias = model.linear.bias.data.clone()
print("Final weight:", final_weight)
print("Final bias:", final_bias)