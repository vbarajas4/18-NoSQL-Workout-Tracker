const router = require("express").Router();
const { Workout } = require("../models/");

router.post('/api/workouts', (req, res) => {
    Workout.create({})
    .then((dbWorkout => {
        res.json(dbWorkout);
    }))
    .catch(err => {
        res.json(err);
      });
});

router.put('/api/workouts/:id', ({ body, params }, res) => {
    Workout.findByIdAndUpdate(
      params.id,
      { $push: { exercises: body } },
      // "runValidators" will ensure new exercises meet our schema requirements
      { new: true, runValidators: true }
    )
      .then((dbWorkout) => {
        res.json(dbWorkout);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  router.get("/api/workouts", (req, res) => {
    Workout.aggregate([{$addFields: { totalDuration: {$sum: '$exercises.duration'} }}])
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      });
      //need to add total duration
  });

  router.get("/api/workouts/range", (req, res) => {
  //aggregate allows us to add fields without needing to modify models
    Workout.aggregate([{$addFields: { totalDuration: {$sum: '$exercises.duration'} }}])
    .sort({_id: 1})
    .limit(7)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
  });


module.exports = router;