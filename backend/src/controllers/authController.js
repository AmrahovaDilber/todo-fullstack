const User = require('./../models/userModel')
const jwt = require('jsonwebtoken');

const signToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });


exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        const token = signToken(newUser._id);
        res.status(201).json({
            status: 'success',
            data: { user: { id: newUser._id, name: newUser.name, email: newUser.email }, token }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email }).select('+password');
        const isMatch = user && await user.correctPassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password.' });
        }

        res.status(200).json({ status: 'success', token: signToken(user._id) });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};