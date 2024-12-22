const Catagory = require('../models/Catagory');


exports.getAllCatagories = async (req, res) => {
    try {
        const catagories = await Catagory.find();
        res.status(200).json(catagories);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}
exports.getCatagoryById = async (req, res) => {
    try {
        const catagory = await Catagory.findById(req.params.id);
        if (!catagory) {
            return res.status(404).json({
                status: 'fail',
                message: 'Catagory not found',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                catagory,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}
exports.createCatagory = async (req, res) => {
    try {
        const newCatagory = await Catagory.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                catagory: newCatagory,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}
exports.updateCatagory = async (req, res) => {
    try {
        const updatedCatagory = await Catagory.findByIdAndUpdate
            (req.params.id, req.body, { new: true });
        if (!updatedCatagory) {
            return res.status(404).json({
                status: 'fail',
                message: 'Catagory not found',
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                catagory: updatedCatagory,
            },
        });
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}
exports.deleteCatagory = async (req, res) => {
    try {
        const deletedCatagory = await Catagory.findByIdAndDelete(req.params.id);
        if (!deletedCatagory) {
            return res.status(404).json({
                status: 'fail',
                message: 'Catagory not found',
            });
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        });
    }
}
