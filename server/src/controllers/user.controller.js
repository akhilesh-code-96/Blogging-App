import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import uploadImageToCloudinary from "../utils/cloudinary.js";

export default class UserController {
  async registerUser(req, res) {
    const { firstName, lastName, company, role, email, phone, password } =
      req.body;
    const imagePath = req.file.path;
    try {
      const uploadResult = await uploadImageToCloudinary(imagePath);
      const photoUrl = uploadResult.secure_url;
      const hashedPassword = await bcrypt.hash(password, 10);

      const record = new UserModel({
        imageUrl: photoUrl,
        firstname: firstName,
        lastname: lastName,
        company: company,
        role: role,
        email: email,
        phone: phone,
        password: hashedPassword,
      });
      await record.save();

      res
        .status(200)
        .json({ message: "User registered successfully", photoUrl });
    } catch (error) {
      res
        .status(501)
        .json({ error: "Image upload failed", details: error.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      req.session.userEmail = email;
      res
        .status(200)
        .json({
          user,
          sessionId: req.session.id,
          email: req.session.userEmail,
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUser(req, res) {
    const { email } = req.body;
    try {
      const user = await UserModel.find({ email });
      res.status(200).json({ user: user });
    } catch (error) {
      res.status(501).json({ message: "Failed to load the user" });
    }
  }

  async updateAbout(req, res) {
    const { email, about } = req.body;
    try {
      await UserModel.updateOne({email: email}, {$set: {about: about}});
      res.status(200).json({message: "User about updated successfully"});
    } catch (error) {
      res.status(501).json({message: "Failed to update the about"});
    }
  }

  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.status(501).json({ message: "logout failed" });
      } else {
        res.status(200).json({ message: "logged out successfully" });
      }
    });
  }


  async userInfo(req, res) {
    const {userId} = req.body;
    if (userId) {
      try {
        const user = await UserModel.find({_id: userId});
        // console.log(user);
        res.status(200).json({ user });
      } catch (error) {
        res.status(404).json({message: "Failed to fetch the user"});
      }
    }
  }
}
