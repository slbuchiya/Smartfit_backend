const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://Sachin1966:Sachin1966@smartfit.bocyckn.mongodb.net/smartfit_db?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connection successful'))
.catch((err) => console.error('MongoDB connection error:', err));

// --------------------
// User Schema
// --------------------
const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: { type: String, required: true },
  age: { type: Number, min: 0 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  height: { type: Number, min: 0 },
  weight: { type: Number, min: 0 },
  goal: { 
  type: String, 
  enum: ['Muscle Gain', 'Weight Loss', 'StayFit'], 
  default: 'StayFit' 
},
}, { timestamps: true });

const User = mongoose.model('smartfit_users', userSchema);

// --------------------
// --------------------
// ⭐️ 1. NAVI PROGRESS SCHEMA (Ahi add karo)
// --------------------
const completedWorkoutSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'smartfit_users', // 'smartfit_users' model sathe link
    required: true 
  },
  workoutName: { type: String, required: true },
  workoutCategory: { type: String, required: true }, // e.g., "Arms", "Chest"
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, default: 0 }, // User ketlu vajan uthavyu
  date: { type: Date, default: Date.now } // Save karvano time
}, { timestamps: true });

const CompletedWorkout = mongoose.model('completed_workouts', completedWorkoutSchema);

// ⭐️ NAVI QUOTES ARRAY (Ahi add karyu chhe)
// --------------------
const motivationQuotes = [
    "\"The only bad workout is the one that didn't happen.\"",
    "\"No Pain, No Gain!\"",
    "\"Your body can stand almost anything. It’s your mind that you have to convince.\"",
    "\"Success starts with self-discipline.\"",
    "\"Don’t stop when you’re tired. Stop when you’re done.\"",
    "\"Sweat is just fat crying.\"",
    "\"Do something today that your future self will thank you for.\"",
    "\"Motivation is what gets you started. Habit is what keeps you going.\"",
    "\"Action is the foundational key to all success.\"",
    "\"Don't limit your challenges. Challenge your limits.\""
];
// Arms Workouts Static Data
// --------------------
const workouts = [
  {
    id: 1,
    name: "Tricep Dips",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/tricep_dips.webp",
    sets: 3,
    reps: 15,
    description: "Bodyweight dips to engage triceps and burn arm fat.",
    goal: "loseWeight"
  },
  {
    id: 2,
    name: "Punches with Dumbbells",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/Punches_Dumbbells.webp",
    sets: 3,
    reps: 45, // seconds
    description: "Alternate dumbbell punches to raise heart rate and tone arms.",
    goal: "loseWeight"
  },
  {
    id: 3,
    name: "Arm Circles",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/arm_circles.webp",
    sets: 3,
    reps: 60, // seconds
    description: "Forward & backward arm circles to work shoulders + arms for endurance.",
    goal: "loseWeight"
  },
  {
    id: 4,
    name: "Plank Shoulder Taps",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/plank_shoulder_taps.webp",
    sets: 3,
    reps: 20, // taps (10 each side)
    description: "Plank with shoulder taps, engages arms, core and burns calories.",
    goal: "loseWeight"
  },
  {
    id: 5,
    name: "Tricep Dips",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/tricep_dips.webp",
    sets: 3,
    reps: 12,
    description: "Tricep dips for definition and endurance rather than heavy size.",
    goal: "stayFit"
  },
  {
    id: 6,
    name: "Hammer Curls",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/hammercurl.webp",
    sets: 3,
    reps: 12,
    description: "Hammer curls using light dumbbells to tone biceps without heavy bulk.",
    goal: "stayFit"
  },
  {
    id: 7,
    name: "Overhead Tricep Extension",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/overhead_tricep_extension.png",
    sets: 3,
    reps: 12,
    description: "Extending dumbbells overhead for triceps control and arm tone.",
    goal: "stayFit"
  },
  {
    id: 8,
    name: "Alternating Dumbbell Curls",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/1alternativ.webp",
    sets: 3,
    reps: 15,
    description: "Alternating curls to maintain arm muscle with moderate reps for toning.",
    goal: "stayFit"
  },
  {
    id: 9,
    name: "Biceps Curls",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/bicepscurls.png",
    sets: 3,
    reps: 12,
    description: "Classic biceps curls with dumbbells for building arm size.",
    goal: "buildMuscle"
  },
  {
    id: 10,
    name: "Dumbbell Kickback",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/dumbelkickback.webp",
    sets: 3,
    reps: 15,
    description: "Tricep kickbacks to focus on muscle growth of triceps.",
    goal: "buildMuscle"
  },
  {
    id: 11,
    name: "Overhead Tricep Extension",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/overhead_tricep_extension.png",
    sets: 3,
    reps: 12,
    description: "Overhead tricep extensions for full long-head tricep activation.",
    goal: "buildMuscle"
  },
  {
    id: 12,
    name: "Concentration Curls",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/consontrate.webp",
    sets: 3,
    reps: 10,
    description: "Concentration curls for isolated biceps peak and strength.",
    goal: "buildMuscle"
  }
];

// Legs Workouts Static Data
// -------------------------
const legsWorkouts = [
  // 🏋️ Build Muscle (4 Workouts)
  {
    id: 1,
    name: "Calf Raises",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/calf_raises.jpeg",
    sets: 3,
    reps: 15,
    description: "Stand straight with your feet shoulder-width apart. Slowly raise your heels until you’re standing on your toes, then lower back down. Helps strengthen calves and improve ankle stability.",
    goal: "buildMuscle"
  },
  {
    id: 2,
    name: "Leg Press",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/leg_press.png",
    sets: 4,
    reps: 12,
    description: "Sit on the leg press machine with your feet shoulder-width apart. Push the platform upward by extending your legs, then slowly return to the starting position. Builds quadriceps and glutes.",
    goal: "buildMuscle"
  },
  {
    id: 3,
    name: "Barbell Squats",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/barbell%20sqauts.webp",
    sets: 4,
    reps: 10,
    description: "Hold a barbell on your shoulders, squat down keeping chest up and core tight, then push back up. Great for building overall leg mass.",
    goal: "buildMuscle"
  },
  {
    id: 4,
    name: "Bulgarian Split Squat",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/bulgerian.webp",
    sets: 3,
    reps: 10,
    description: "Place one foot behind on a bench, lower your body until front knee at 90°, push back up. Focuses on quads and glutes for strength.",
    goal: "buildMuscle"
  },

  // 💪 Stay Fit (4 Workouts)
  {
    id: 5,
    name: "Bodyweight Squats",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/bodyweight_squats.webp",
    sets: 3,
    reps: 15,
    description: "Perform squats using your body weight to maintain strength and flexibility. Great for joint health.",
    goal: "stayFit"
  },
  {
    id: 6,
    name: "Step Ups",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/stepup.webp",
    sets: 3,
    reps: 12,
    description: "Step up onto a bench or platform, alternating legs. Improves balance, coordination, and endurance.",
    goal: "stayFit"
  },
  {
    id: 7,
    name: "Squats",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/squats.png",
    sets: 3,
    reps: 15,
    description: "Stand with feet shoulder-width apart, keep your chest up, and bend your knees to lower your hips like sitting on a chair. Push through your heels to return. Great for overall lower body strength.",
    goal: "stayFit"
  },
  {
    id: 8,
    name: "Glute Bridges",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/glutz.webp",
    sets: 3,
    reps: 15,
    description: "Lie on your back with knees bent, lift your hips to engage glutes and hamstrings. Good for posture and stability.",
    goal: "stayFit"
  },

  // 🔥 Lose Weight (4 Workouts)
  {
    id: 9,
    name: "Lunges",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/lunges.png",
    sets: 3,
    reps: 10,
    description: "Step forward with one leg and lower your body until both knees are bent at 90 degrees. Push back up and repeat on the other side. Strengthens hamstrings, glutes, and quads.",
    goal: "loseWeight"
  },
  {
    id: 10,
    name: "Jump Squats",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/jumpsquts.webp",
    sets: 3,
    reps: 15,
    description: "Perform explosive squats jumping off the ground, landing softly. Burns high calories and improves explosiveness.",
    goal: "loseWeight"
  },
  {
    id: 11,
    name: "Mountain Climbers",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/mountainclimer.webp",
    sets: 3,
    reps: 45,
    description: "Start in plank position and alternate bringing knees toward your chest quickly. Full-body cardio for weight loss.",
    goal: "loseWeight"
  },
  {
    id: 12,
    name: "High Knees",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/legs/highkness.webp",
    sets: 3,
    reps: 45,
    description: "Run in place lifting knees high toward chest. Great cardio and burns leg fat effectively.",
    goal: "loseWeight"
  }
];



// Chest Workouts Static Data
// --------------------
const chestWorkouts = [
  // 💪 BUILD MUSCLE (4 Workouts)
  {
    id: 1,
    name: "Bench Press",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/bench_press.jpg",
    sets: 4,
    reps: 12,
    description: "Lie on bench, hold barbell, push up until arms are straight, lower slowly. Builds overall chest strength.",
    goal: "buildMuscle"
  },
  {
    id: 2,
    name: "Incline Dumbbell Press",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/incline_dumbbell_press.png",
    sets: 3,
    reps: 12,
    description: "Set bench at incline, hold dumbbells, press up, lower slowly to target upper chest.",
    goal: "buildMuscle"
  },
  {
    id: 3,
    name: "Decline Bench Press",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/declinepress.webp",
    sets: 4,
    reps: 10,
    description: "Bench angled downwards to target lower chest. Use barbell or dumbbells for variation.",
    goal: "buildMuscle"
  },
  {
    id: 4,
    name: "Cable Crossover",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/cablecrosover.webp",
    sets: 3,
    reps: 15,
    description: "Pull cables from both sides inwards and upward for chest contraction. Ideal for shaping pecs.",
    goal: "buildMuscle"
  },

  // 🧘 STAY FIT (4 Workouts)
  {
    id: 5,
    name: "Chest Fly",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/chest_fly.webp",
    sets: 3,
    reps: 15,
    description: "Lie on flat bench, hold dumbbells, arms out wide and bring together over chest for controlled movement.",
    goal: "stayFit"
  },
  {
    id: 6,
    name: "Incline Push-Ups",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/inclinepishup.webp",
    sets: 3,
    reps: 20,
    description: "Perform push-ups with hands on an elevated surface to target upper chest with moderate intensity.",
    goal: "stayFit"
  },
  {
    id: 7,
    name: "Dumbbell Pullover",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/pullover.webp",
    sets: 3,
    reps: 15,
    description: "Lie on bench, hold dumbbell above chest and lower behind head slowly to stretch chest and lats.",
    goal: "stayFit"
  },
  {
    id: 8,
    name: "Knee Push-Ups",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/kneepushup.webp",
    sets: 3,
    reps: 20,
    description: "Modified push-ups on knees. Great for maintaining chest tone and endurance.",
    goal: "stayFit"
  },

  // 🔥 LOSE WEIGHT (4 Workouts)
  {
    id: 9,
    name: "Push Ups",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/push_ups.png",
    sets: 3,
    reps: 20,
    description: "Hands shoulder-width apart, lower chest to floor, push up, keep body straight. Classic bodyweight fat-burner.",
    goal: "loseWeight"
  },
  {
    id: 10,
    name: "Burpees",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/burpess.webp",
    sets: 3,
    reps: 15,
    description: "Full-body movement combining push-up, jump, and squat. Extremely effective for fat loss and stamina.",
    goal: "loseWeight"
  },
  {
    id: 11,
    name: "Mountain Climbers",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/mountain_climbers.webp",
    sets: 3,
    reps: 45,
    description: "Start in plank and run in place by driving knees forward. Boosts heart rate and burns chest fat.",
    goal: "loseWeight"
  },
  {
    id: 12,
    name: "Incline Push-Ups (Fast Reps)",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/inclinepishup.webp",
    sets: 3,
    reps: 25,
    description: "Fast-paced incline push-ups targeting chest and triceps for high-calorie burn.",
    goal: "loseWeight"
  }
];



// Abs Workouts Static Data
// --------------------
const absWorkouts = [
  // 🔥 LOSE WEIGHT (4 Workouts)
  {
    id: 1,
    name: "Crunches",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/crunches.webp",
    sets: 3,
    reps: 20,
    description: "Lie on your back, knees bent, lift shoulders off the floor, squeeze abs, and lower slowly to burn belly fat.",
    goal: "loseWeight"
  },
  {
    id: 2,
    name: "Russian Twists",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/russian_twists.jpg",
    sets: 3,
    reps: 20,
    description: "Sit on floor, lean back slightly, twist torso side to side holding weight or hands together. Engages obliques and core.",
    goal: "loseWeight"
  },
  {
    id: 3,
    name: "Mountain Climbers",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/chest/mountain_climbers.webp",
    sets: 3,
    reps: 45,
    description: "Start in plank position, drive knees alternately towards your chest. Cardio + abs combo for fat burning.",
    goal: "loseWeight"
  },
  {
    id: 4,
    name: "Flutter Kicks",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/flutter_kicks.webp",
    sets: 3,
    reps: 30,
    description: "Lie on your back, lift legs slightly and alternate kicks up and down. Targets lower abs effectively.",
    goal: "loseWeight"
  },

  // 🧘 STAY FIT (4 Workouts)
  {
    id: 5,
    name: "Leg Raises",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/leg_raises.webp",
    sets: 3,
    reps: 15,
    description: "Lie flat and lift legs up to 90 degrees. Builds core control and stability.",
    goal: "stayFit"
  },
  {
    id: 6,
    name: "Plank",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/plank.png",
    sets: 3,
    reps: 60,
    description: "Hold forearm plank position with a straight back. Strengthens core and spine alignment.",
    goal: "stayFit"
  },
  {
    id: 7,
    name: "Side Plank",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/sideplank.webp",
    sets: 3,
    reps: 30,
    description: "Hold plank on one side with elbow under shoulder. Great for obliques and balance.",
    goal: "stayFit"
  },
  {
    id: 8,
    name: "Seated Knee Tucks",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/seatedkneetucks.webp",
    sets: 3,
    reps: 20,
    description: "Sit on edge, lean slightly back, pull knees toward chest and extend. Strengthens entire core.",
    goal: "stayFit"
  },

  // 💪 BUILD MUSCLE (4 Workouts)
  {
    id: 9,
    name: "Cable Crunch",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/cablecrunch.webp",
    sets: 4,
    reps: 12,
    description: "Kneel under cable machine, crunch forward pulling rope towards knees. Builds thick core muscles.",
    goal: "buildMuscle"
  },
  {
    id: 10,
    name: "Weighted Sit-Ups",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/weightedsitup.webp",
    sets: 4,
    reps: 15,
    description: "Hold a plate or dumbbell over your chest while doing sit-ups to add resistance for muscle growth.",
    goal: "buildMuscle"
  },
  {
    id: 11,
    name: "Hanging Leg Raises",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/hanginglegraise.webp",
    sets: 4,
    reps: 12,
    description: "Hang from pull-up bar and lift legs to hip height or higher. Excellent for lower abs and grip strength.",
    goal: "buildMuscle"
  },
  {
    id: 12,
    name: "Ab Rollouts",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/abs/abrolloit.webp",
    sets: 4,
    reps: 10,
    description: "Use ab roller to roll forward and return. High tension exercise for strong core development.",
    goal: "buildMuscle"
  }
];

// Back Workouts Static Data
// --------------------
const backWorkouts = [
  // 💪 BUILD MUSCLE (4 Workouts)
  {
    id: 1,
    name: "Bent Over Row",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/bentoverrow.jpg",
    sets: 4,
    reps: 10,
    description: "Hold barbell, bend at hips, pull bar towards torso, then lower slowly. Builds middle back thickness.",
    goal: "buildMuscle"
  },
  {
    id: 2,
    name: "Deadlift",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/deadlift.webp",
    sets: 4,
    reps: 8,
    description: "Lift barbell from ground keeping spine neutral and core tight. Full-body compound move for strength and mass.",
    goal: "buildMuscle"
  },
  {
    id: 3,
    name: "Seated Cable Row",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/seatedbackrow.png",
    sets: 3,
    reps: 12,
    description: "Sit at cable row machine, pull handle toward abdomen, squeeze shoulder blades together, and release slowly.",
    goal: "buildMuscle"
  },
  {
    id: 4,
    name: "T-Bar Row",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/tbarrow.png",
    sets: 3,
    reps: 10,
    description: "Hold T-bar close to chest and pull toward upper abs. Builds lats and rhomboids.",
    goal: "buildMuscle"
  },

  // 🧘 STAY FIT (4 Workouts)
  {
    id: 5,
    name: "Lat Pulldown",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/latpulldown.webp",
    sets: 3,
    reps: 12,
    description: "Sit at lat pulldown machine, pull bar down to chest, control on the way up. Keeps back lean and flexible.",
    goal: "stayFit"
  },
  {
    id: 6,
    name: "Superman Hold",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/sprmanhold.png",
    sets: 3,
    reps: 45,
    description: "Lie face down, lift arms and legs off the floor, hold for few seconds. Strengthens lower back and posture.",
    goal: "stayFit"
  },
  {
    id: 7,
    name: "Resistance Band Row",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/resitntbandrow.webp",
    sets: 3,
    reps: 15,
    description: "Anchor resistance band, pull towards torso squeezing shoulder blades. Light resistance for tone and mobility.",
    goal: "stayFit"
  },
  {
    id: 8,
    name: "Back Extensions",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/backextension.webp",
    sets: 3,
    reps: 15,
    description: "Lie face down on a stability ball or bench, raise torso up to strengthen spinal erectors and lower back.",
    goal: "stayFit"
  },

  // 🔥 LOSE WEIGHT (4 Workouts)
  {
    id: 9,
    name: "Pull Ups",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/pullups.webp",
    sets: 3,
    reps: 8,
    description: "Hang from bar, pull body up until chin clears bar. Great for fat burn and upper-body endurance.",
    goal: "loseWeight"
  },
  {
    id: 10,
    name: "Inverted Rows",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/invertedrow.webp",
    sets: 3,
    reps: 12,
    description: "Lie under a bar and pull chest toward it. Bodyweight exercise to tone back and arms.",
    goal: "loseWeight"
  },
  {
    id: 11,
    name: "High Knees to Pull",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/pullkness.webp",
    sets: 3,
    reps: 45,
    description: "Perform high knees while mimicking a pull motion with arms. Great cardio for upper-back activation.",
    goal: "loseWeight"
  },
  {
    id: 12,
    name: "Plank Rows",
    image: "https://raw.githubusercontent.com/deeppatel-bit/smatfit_img/main/arms/back/plankrow.webp",
    sets: 3,
    reps: 20,
    description: "In plank position, row dumbbell toward torso alternating sides. Builds stability and burns fat simultaneously.",
    goal: "loseWeight"
  }
];


// --------------------
// User APIs
// --------------------

// ✅ Create Account API (fixed to return userId + user data)
app.post('/api/register',
  [
    body('full_name').exists().isString().trim(),
    body('email').exists().isEmail().normalizeEmail(),
    body('password').exists(),
    body('age').optional().isInt({ min: 13, max: 100 }),
    body('gender').optional().isIn(['Male', 'Female', 'Other']),
    body('height').optional().isFloat({ min: 100, max: 250 }),
    body('weight').optional().isFloat({ min: 30, max: 500 }),
    body('goal').optional().isString().trim().isIn(['Muscle Gain', 'Fat Loss', 'Maintain']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { full_name, email, password, age, gender, height, weight, goal } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(409).json({ error: 'Email already registered' });

      const newUser = new User({ full_name, email, password, age, gender, height, weight, goal });

      console.log("Saving user:", req.body);
      await newUser.save();
      console.log("✅ User saved successfully:", newUser._id);

      // ⭐ Return full user object (without password)
      const safeUser = {
        _id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
        age: newUser.age || 0,
        gender: newUser.gender || "N/A",
        height: newUser.height || 0,
        weight: newUser.weight || 0,
        goal: newUser.goal || "StayFit",
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      return res.status(201).json({
        message: "User registered successfully",
        userId: newUser._id,
        user: safeUser
      });

    } catch (err) {
      console.error("❌ Signup error:", err);
      return res.status(500).json({ error: 'Server error: ' + err.message });
    }
  }
);

// Login API
app.post('/api/login',
  [
    body('email').exists().isEmail().normalizeEmail(),
    body('password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || user.password !== password)
        return res.status(401).json({ error: 'Invalid credentials' });

      res.json({ message: 'Login successful', userId: user._id });
    } catch (err) {
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
  }
);

// View profile
app.get('/api/users', async (req, res) => {
  const email = req.query.email;
  if (!email) return res.status(400).json({ error: 'Email query parameter is required' });

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Edit profile
app.put('/api/users/edit', 
  [
    body('email').exists().isEmail().normalizeEmail(),
    body('full_name').optional().isString().trim(),
    body('password').optional().isLength({ min: 6 }),
    body('age').optional().isInt({ min: 0 }),
    body('gender').optional().isIn(['Male', 'Female', 'Other']),
    body('height').optional().isFloat({ min: 0 }),
    body('weight').optional().isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const email = req.body.email.toLowerCase().trim();
    const updates = { ...req.body };
    delete updates.email; // Prevent changing email

    try {
      const user = await User.findOneAndUpdate(
        { email },
        updates,
        { new: true, runValidators: true }
      ).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.json(user);
    } catch (err) {
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
  }
);

// --------------------
// --------------------
// ⭐️ 2. NAVA PROGRESS APIs (Ahi add karo)
// --------------------

// 1. Save Workout Progress (Android 'Done' button aane call karshe)
app.post('/api/progress/save', [
    body('userId').exists().isString(),
    body('workoutName').exists().isString(),
    body('workoutCategory').exists().isString(),
    body('sets').exists().isInt(),
    body('reps').exists().isInt(),
    body('weight').optional().isFloat()
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, workoutName, workoutCategory, sets, reps, weight } = req.body;

      // User chhe ke nahi e check karo (aa 'User' model tamari paase already che)
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const newEntry = new CompletedWorkout({
        userId,
        workoutName,
        workoutCategory,
        sets,
        reps,
        weight: weight || 0 // Jo weight na male to 0
      });

      await newEntry.save();
      res.status(201).json({ message: 'Workout saved successfully', data: newEntry });

    } catch (err) {
      console.error("Error saving progress:", err);
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// 2. Get All Workout History for a User (Android 'Progress' tab aane call karshe)
app.get('/api/progress/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // User Id valid che ke nahi e check karo
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const history = await CompletedWorkout.find({ userId: userId })
                                        .sort({ date: 'asc' }); // Juna data pela

    if (!history || history.length === 0) { // Jo koi history na male to
      return res.status(404).json({ message: 'No workout history found for this user.' });
    }

    res.json(history);

  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// --------------------
// Workouts API
// --------------------

// ✅ ARMS (Main)
app.get('/api/workouts', (req, res) => {
  console.log("Workouts route hit", { query: req.query });
  const id = req.query.id ? parseInt(req.query.id) : null;
  if (id) {
    const workout = workouts.find(w => w.id === id);
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    return res.json(workout);
  }

  const goal = req.query.goal;
  if (goal) {
    const normalizedGoal = goal.replace(/\s/g, "").toLowerCase();
    const filtered = workouts.filter(
      w => w.goal.replace(/\s/g, "").toLowerCase() === normalizedGoal
    );
    return res.json(filtered);
  }

  res.json(workouts);
});

// ✅ LEGS
app.get('/api/workouts/legs', (req, res) => {
  const goal = req.query.goal;
  if (goal) {
    const normalizedGoal = goal.replace(/\s/g, "").toLowerCase();
    const filtered = legsWorkouts.filter(
      w => w.goal.replace(/\s/g, "").toLowerCase() === normalizedGoal
    );
    return res.json(filtered);
  }
  res.json(legsWorkouts);
});

// ✅ CHEST
app.get('/api/workouts/chest', (req, res) => {
  const goal = req.query.goal;
  if (goal) {
    const normalizedGoal = goal.replace(/\s/g, "").toLowerCase();
    const filtered = chestWorkouts.filter(
      w => w.goal.replace(/\s/g, "").toLowerCase() === normalizedGoal
    );
    return res.json(filtered);
  }
  res.json(chestWorkouts);
});

// ✅ ABS
app.get('/api/workouts/abs', (req, res) => {
  const goal = req.query.goal;
  if (goal) {
    const normalizedGoal = goal.replace(/\s/g, "").toLowerCase();
    const filtered = absWorkouts.filter(
      w => w.goal.replace(/\s/g, "").toLowerCase() === normalizedGoal
    );
    return res.json(filtered);
  }
  res.json(absWorkouts);
});

// ✅ BACK
app.get('/api/workouts/back', (req, res) => {
  const goal = req.query.goal;
  if (goal) {
    const normalizedGoal = goal.replace(/\s/g, "").toLowerCase();
    const filtered = backWorkouts.filter(
      w => w.goal.replace(/\s/g, "").toLowerCase() === normalizedGoal
    );
    return res.json(filtered);
  }
  res.json(backWorkouts);
});

// ✅ ALL CATEGORIES (Filter by goal)
app.get('/api/workouts/filter', (req, res) => {
  const goal = req.query.goal;
  if (!goal) return res.status(400).json({ error: 'Goal is required' });

  const normalizedGoal = goal.replace(/\s/g, "").toLowerCase();
  const filtered = [
    ...workouts,
    ...legsWorkouts,
    ...chestWorkouts,
    ...absWorkouts,
    ...backWorkouts,
  ].filter(
    w => w.goal.replace(/\s/g, "").toLowerCase() === normalizedGoal
  );

  res.json(filtered);
});

// ✅ SINGLE WORKOUT (by ID)
app.get('/api/workouts/id/:id', (req, res) => {
  console.log("Single workout route hit", { params: req.params });
  const workout = workouts.find(w => w.id === parseInt(req.params.id));
  if (!workout) return res.status(404).json({ error: 'Workout not found' });
  res.json(workout);
});



// ---------------------------
// ✅ Keep server awake on Render (CommonJS version)
// ---------------------------

const cron = require("node-cron");
const fetch = require("node-fetch");

// Ping route (so you can test in browser)
app.get("/ping", (req, res) => {
  res.status(200).send("✅ SmartFit2 backend awake and running fine!");
});

// Every 10 minutes, auto-ping Render server to prevent sleep
cron.schedule("*/10 * * * *", async () => {
  try {
    await fetch("https://smartfit-backend-qwq8.onrender.com/ping");
    console.log("🔥 Keep-alive ping sent successfully (SmartFit backend)");
  } catch (err) {
    console.error("❌ Keep-alive ping failed:", err.message);
  }
});


// --------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});







