const fs = require('fs')
const path = require('path')

const { validationResult } = require('express-validator/check')

const Wish = require('../models/wish')
const User = require('../models/user')

exports.getWishes = async (req, res, next) => {
  // const currentPage = req.query.page || 1
  // const perPage = 2
  try {
    // const totalItems = await Wish.find({"creator._id": req.userId}).countDocuments()
    const totalItems = await Wish.find().countDocuments()
    const wishes = await Wish.find()
      .populate('creator')
      .sort({createdAt: -1})
      // .skip((currentPage - 1) * perPage)
      // .limit(perPage)

    res.status(200).json({
      message: 'Fetched wishes successfully.',
      wishes: wishes,
      totalItems: totalItems
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.createWish = async (req, res, next) => {
  const errors = validationResult(req)
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.')
      error.statusCode = 422
      throw error
    }
    // if (!req.file) {
    //   const error = new Error('No image provided.')
    //   error.statusCode = 422
    //   throw error
    // }
    // const imageUrl = req.file.path
    // const imageUrl = req.body.imageUrl
    // const title = req.body.title
    // const description = req.body.description
    // const averagePrice = req.body.averagePrice
    // const wish = new Wish({
    //   title: title,
    //   description: description,
    //   imageUrl: imageUrl,
    //   averagePrice, averagePrice,
    //   creator: req.userId
    // })
    const wish = new Wish({...req.body, creator: req.userId})
    try {
      await wish.save()
      const user = await User.findById(req.userId)
      user.wishes.push(wish)
      await user.save()
      res.status(201).json({
        message: 'Wish created successfully!',
        wish: wish,
        creator: { _id: user._id, name: user.name }
      })
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    }
  } catch (error) {
    next(error)
  }
}

exports.getWish = async (req, res, next) => {
  const wishId = req.params.wishId
  const wish = await Wish.findById(wishId).populate('creator', 'name')
  try {
    if (!wish) {
      const error = new Error('Could not find wish.')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'Wish fetched.', wish: wish })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.updateWish = async (req, res, next) => {
  const wishId = req.params.wishId
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.')
    error.statusCode = 422
    throw error
  }
  const title = req.body.title
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  const averagePrice = req.body.averagePrice
  // if (req.file) {
  //   imageUrl = req.file.path
  // }
  // if (!imageUrl) {
  //   const error = new Error('No file picked.')
  //   error.statusCode = 422
  //   throw error
  // }
  try {
    const wish = await Wish.findById(wishId).populate('creator')
    if (!wish) {
      const error = new Error('Could not find wish.')
      error.statusCode = 404
      throw error
    }
    if (wish.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized!')
      error.statusCode = 403
      throw error
    }
    // if (imageUrl !== wish.imageUrl) {
    //   clearImage(wish.imageUrl)
    // }
    wish.title = title
    wish.imageUrl = imageUrl
    wish.description = description
    if (averagePrice) {
      wish.averagePrice = averagePrice
    }
    const result = await wish.save()
    res.status(200).json({ message: 'Wish updated!', wish: result })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.deleteWish = async (req, res, next) => {
  const wishId = req.params.wishId
  try {
    const wish = await Wish.findById(wishId)

    if (!wish) {
      const error = new Error('Could not find wish.')
      error.statusCode = 404
      throw error
    }
    if (wish.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!')
      error.statusCode = 403
      throw error
    }
    // clearImage(wish.imageUrl)
    await Wish.findByIdAndRemove(wishId)

    const user = await User.findById(req.userId)
    user.wishes.pull(wishId)
    await user.save()
    res.status(200).json({ message: 'Deleted wish.' })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath)
  fs.unlink(filePath, err => console.log(err))
}

exports.contributeToWish = async (req, res, next) => {
  const wishId = req.params.wishId
  try {
    const wish = await Wish.findById(wishId)

    if (!wish) {
      const error = new Error('Could not find wish.')
      error.statusCode = 404
      throw error
    }
    wish.contributors.push(req.userId)
    await wish.save()
    
    const user = await User.findById(req.userId)
    user.contributing.push(wishId)
    await user.save()

    res.status(200).json({ message: 'A gift consists not in what is done or given, but in the intention of the giver or doer.'})
     
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err) 
  }
}