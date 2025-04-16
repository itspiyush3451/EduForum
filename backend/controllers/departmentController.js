import * as departmentService from "../services/departmentService.js";

// Controller function to create a new department
export async function createDepartment(req, res) {
  try {
    const { name, description } = req.body;
    
    // Validate required fields
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Department name is required" });
    }

    // Pass the data as an object to match the service's validation schema
    const result = await departmentService.createDepartment({ name, description });
    
    if (result.success) {
      res.status(201).json({
        success: true,
        message: "Department created successfully",
        data: result.data
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error in createDepartment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

// Controller function to get all departments
export async function getAllDepartments(req, res) {
  try {
    const result = await departmentService.getAllDepartments();
    console.log("Backend departments result:", result);
    
    if (result.success) {
      // Send just the departments array
      res.status(200).json(result.data);
    } else {
      res.status(400).json({ success: false, message: "Failed to fetch departments", data: [] });
    }
  } catch (error) {
    console.error("Error in getAllDepartments:", error);
    res.status(500).json({ success: false, message: "Internal server error", data: [] });
  }
}

// Controller function to get a department by ID
export async function getDepartmentById(req, res) {
  try {
    const departmentid = parseInt(req.params.departmentId, 10);
    const result = await departmentService.getDepartmentById(departmentid);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ message: "Department not found" });
    }
  } catch (error) {
    console.error("Error in getDepartmentById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Controller function to update a department
export async function updateDepartment(req, res) {
  try {
    const departmentId = parseInt(req.params.departmentId, 10);
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Department name is required" });
    }

    const result = await departmentService.updateDepartment(departmentId, name);

    // Use appropriate status code based on result
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error in updateDepartment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
// Controller function to delete a department
export async function deleteDepartment(req, res) {
  try {
    const departmentId = parseInt(req.params.departmentId, 10);

    const result = await departmentService.deleteDepartment(departmentId);

    // Use appropriate status code based on result
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error in deleteDepartment:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
