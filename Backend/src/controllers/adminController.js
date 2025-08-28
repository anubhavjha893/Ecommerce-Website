// Admin login
exports.adminSignup = async (req, res) => {
try {
    const { name,email, password } = req.body;
    // Basic validation
     if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if admin exists
    const existingAdmin = await userModel.findOne({ email, role: "admin" });
    if(existingAdmin){
        return res.status(400).json({ message: "Admin already exists" });
    }
    // Hash password    
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create admin
    const newAdmin = new userModel({
      name: name,
      email,
      password: hashedPassword,
      role: "admin"
    });
    await newAdmin.save();
    // Generate token
    const token = jwt.sign(
      { userId: newAdmin._id, email: newAdmin.email, role: newAdmin.role },
      process.env.JWT_SECRET,   
      { expiresIn: '1h' }
    );
    // Store token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 // 1 hour
    });
    res.status(201).json({ message: "Admin created successfully" });

} catch (error) {
    res.status(500).json({ error: error.message });
    
}
};

// login function for admin
exports.adminLogin = async (req, res) => {  
    try {
            const { email, password } = req.body;
            // Check if admin exists
            const admin = await userModel.findOne({ email, role: "admin" });
            if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" });
            }
            // Compare password
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
            }
            // Generate token
            const token = jwt.sign(
            { userId: admin._id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
            );
            // Store token in cookie
            res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only https in prod
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 // 1 hour
            });
            res.status(200).json({ message: "Admin logged in successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

