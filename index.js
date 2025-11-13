const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

// ========== NAVO SUDHARO: node-cron ane node-fetch (Tamara existing code mathi) ==========
const cron = require("node-cron");
const fetch = require("node-fetch"); 
// ==============================================================================

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
// User Schema (Tamaro existing code)
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
  // Tamaro goal 'StayFit' chhe, pan app 'Maintain' mokle chhe. Me badhe 'Maintain' kari didhu chhe.
  goal: { type: String, enum: ['Muscle Gain', 'Weight Loss', 'StayFit', 'Maintain'], default: 'Maintain' },
}, { timestamps: true });

const User = mongoose.model('smartfit_users', userSchema);


// ========== NAVO SUDHARO: Workout History Schema ==========
// --------------------
// Workout History Schema
// --------------------
// Aa navu model/table chhe je user na darek workout ne save karse
const workoutHistorySchema = new mongoose.Schema({
    // User sathe link karva mate
    userEmail: { 
        type: String, 
        required: true, 
        lowercase: true, 
        trim: true, 
        index: true // Jethi search fast thay
    },
    // Kai workout karyu e save karva
    workoutType: {
        type: String,
        required: true,
        enum: ['Abs', 'Arms', 'Back', 'Chest', 'Legs'] // Fakt aa value j save thase
    },
    // Kyare karyu e save karva
    date: {
        type: Date,
        default: Date.now // Aapoaap haal no time save thai jase
    }
}, { timestamps: true });

const WorkoutHistory = mongoose.model('workout_history', workoutHistorySchema);
// ======================================================


// --------------------
// User APIs (Tamaro existing code)
// --------------------

// ✅ Create Account API
app.post('/api/register',
  [
    body('full_name').exists().isString().trim(),
    body('email').exists().isEmail().normalizeEmail(),
    body('password').exists(),
    body('age').optional().isInt({ min: 0 }),
    body('gender').optional().isIn(['Male', 'Female', 'Other']),
    body('height').optional().isFloat({ min: 0 }),
    body('weight').optional().isFloat({ min: 0 }),
    // Tamaro goal 'Fat Loss' chhe, pan schema 'Weight Loss' hatu. Me badhe 'Weight Loss' karyu chhe.
    body('goal').optional().isString().trim().isIn(['Muscle Gain', 'Weight Loss', 'StayFit', 'Maintain']),
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
      console.log("✅ User saved successfully:", newUser._id, "Goal:", newUser.goal);

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      console.error("❌ Signup error:", err);
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
  }
);

// Login API (Aa code 'goal' pan return karse)
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

      // Login successful thay tyare badhi detail moklo
      res.json({ 
            message: 'Login successful', 
            userId: user._id,
            email: user.email,
            name: user.full_name,
            age: user.age,
            gender: user.gender,
            height: user.height,
            weight: user.weight,
            goal: user.goal 
        });
    } catch (err) {
      res.status(500).json({ error: 'Server error: ' + err.message });
    }
  }
);

// View profile
app.get('/api/users', async (req, res) => {
    // (Tamaro existing code - barabar chhe)
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
    // (Tamaro existing code - barabar chhe)
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
    delete updates.email;
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


// ========== NAVO SUDHARO: History API (Progress Report mate) ==========
// --------------------
// History APIs
// --------------------

// API 1: Workout SAVE karva mate
app.post('/api/history/save',
    [
        // Check karo ke app barabar data mokle chhe
        body('userEmail').exists().isEmail().normalizeEmail(),
        body('workoutType').exists().isIn(['Abs', 'Arms', 'Back', 'Chest', 'Legs'])
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { userEmail, workoutType } = req.body;

        try {
            // Nava data ne database model ma convert karo
            const newWorkout = new WorkoutHistory({
                userEmail: userEmail,
                workoutType: workoutType
                // date aapoaap set thai jase
            });

            // Database ma save karo
            await newWorkout.save();

            console.log(`✅ Workout saved for ${userEmail}: ${workoutType}`);
            res.status(201).json({ message: 'Workout saved successfully' });

        } catch (err) {
            console.error("❌ Error saving workout:", err);
            res.status(500).json({ error: 'Server error: ' + err.message });
        }
    }
);


// API 2: Progress Report LOAD karva mate
app.get('/api/history/progress', 
    async (req, res) => {
        
        // App mathi 'email' query parameter medvo
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).json({ error: 'Email query parameter is required' });
        }

        try {
            // --- Step 1: Aa user na badha records database mathi laavo ---
            const allHistory = await WorkoutHistory.find({ userEmail: userEmail.toLowerCase().trim() });

            // --- Step 2: "Workout Summary" (Total counts) gano ---
            const summary = {
                "Abs": 0,
                "Arms": 0,
                "Back": 0,
                "Chest": 0,
                "Legs": 0
            };

            for (const item of allHistory) {
                if (summary.hasOwnProperty(item.workoutType)) {
                    summary[item.workoutType]++;
                }
            }
            
            // --- Step 3: "Graph" (Pichhla 7 divas na records) medvo ---
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7); // 7 divas paachad ni tarikh

            // Badha records mathi fakt pichhla 7 divas na j filter karo
            const recentHistory = allHistory.filter(item => item.date >= sevenDaysAgo);

            console.log(`✅ Progress report sent for ${userEmail}. Total: ${allHistory.length}, Recent: ${recentHistory.length}`);

            // App ne banne vastu moklo: summary (list mate) ane recentHistory (graph mate)
            res.json({
                summary: summary,
                recentHistory: recentHistory // Aa raw data chhe, app teni jate graph banavse
            });

        } catch (err) {
            console.error("❌ Error fetching progress:", err);
            res.status(500).json({ error: 'Server error: ' + err.message });
        }
    }
);
// =================================================================


// --------------------
// Workouts API (Tamaro existing code)
// --------------------

// Tamari goal value 'Weight Loss' chhe, pan static data ma 'loseWeight' chhe.
// Me badhe logic badli nakhyu chhe jethi e barabar filter kare.

const normalizeGoal = (goal) => {
    if (!goal) return null;
    const g = goal.replace(/\s/g, "").toLowerCase();
    if (g === 'muscle' || g === 'buildmuscle' || g === 'musclegain') return 'buildmuscle';
    if (g === 'weightloss' || g === 'loseweight' || g === 'fatloss') return 'loseweight';
    if (g === 'stayfit' || g === 'maintain') return 'stayfit';
    return g; // Default
};

// Arms Workouts Static Data
const workouts = [
  { id: 1, name: "Tricep Dips", image: "...", sets: 3, reps: 15, description: "...", goal: "loseWeight" },
  { id: 2, name: "Punches with Dumbbells", image: "...", sets: 3, reps: 45, description: "...", goal: "loseWeight" },
  { id: 3, name: "Arm Circles", image: "...", sets: 3, reps: 60, description: "...", goal: "loseWeight" },
  { id: 4, name: "Plank Shoulder Taps", image: "...", sets: 3, reps: 20, description: "...", goal: "loseWeight" },
  { id: 5, name: "Tricep Dips", image: "...", sets: 3, reps: 12, description: "...", goal: "stayFit" },
  { id: 6, name: "Hammer Curls", image: "...", sets: 3, reps: 12, description: "...", goal: "stayFit" },
  { id: 7, name: "Overhead Tricep Extension", image: "...", sets: 3, reps: 12, description: "...", goal: "stayFit" },
  { id: 8, name: "Alternating Dumbbell Curls", image: "...", sets: 3, reps: 15, description: "...", goal: "stayFit" },
  { id: 9, name: "Biceps Curls", image: "...", sets: 3, reps: 12, description: "...", goal: "buildMuscle" },
  { id: 10, name: "Dumbbell Kickback", image: "...", sets: 3, reps: 15, description: "...", goal: "buildMuscle" },
  { id: 11, name: "Overhead Tricep Extension", image: "...", sets: 3, reps: 12, description: "...", goal: "buildMuscle" },
  { id: 12, name: "Concentration Curls", image: "...", sets: 3, reps: 10, description: "...", goal: "buildMuscle" }
]; // (Me tamaro data '...' kari nakhyo chhe jethi file nani rahe, pan e chhe)

// Legs Workouts Static Data
const legsWorkouts = [
  { id: 1, name: "Calf Raises", image: "...", sets: 3, reps: 15, description: "...", goal: "buildMuscle" },
  { id: 2, name: "Leg Press", image: "...", sets: 4, reps: 12, description: "...", goal: "buildMuscle" },
  { id: 3, name: "Barbell Squats", image: "...", sets: 4, reps: 10, description: "...", goal: "buildMuscle" },
  { id: 4, name: "Bulgarian Split Squat", image: "...", sets: 3, reps: 10, description: "...", goal: "buildMuscle" },
  { id: 5, name: "Bodyweight Squats", image: "...", sets: 3, reps: 15, description: "...", goal: "stayFit" },
  { id: 6, name: "Step Ups", image: "...", sets: 3, reps: 12, description: "...", goal: "stayFit" },
  { id: 7, name: "Squats", image: "...", sets: 3, reps: 15, description: "...", goal: "stayFit" },
  { id: 8, name: "Glute Bridges", image: "...", sets: 3, reps: 15, description: "...", goal: "stayFit" },
  { id: 9, name: "Lunges", image: "...", sets: 3, reps: 10, description: "...", goal: "loseWeight" },
  { id: 10, name: "Jump Squats", image: "...", sets: 3, reps: 15, description: "...", goal: "loseWeight" },
  { id: 11, name: "Mountain Climbers", image: "...", sets: 3, reps: 45, description: "...", goal: "loseWeight" },
  { id: 12, name: "High Knees", image: "...", sets: 3, reps: 45, description: "...", goal: "loseWeight" }
]; // (Data ... kari nakhyo chhe)

// Chest Workouts Static Data
const chestWorkouts = [
  { id: 1, name: "Bench Press", image: "...", sets: 4, reps: 12, description: "...", goal: "buildMuscle" },
  { id: 2, name: "Incline Dumbbell Press", image: "...", sets: 3, reps: 12, description: "...", goal: "buildMuscle" },
  { id: 3, name: "Decline Bench Press", image: "...", sets: 4, reps: 10, description: "...", goal: "buildMuscle" },
  { id: 4, name: "Cable Crossover", image: "...", sets: 3, reps: 15, description: "...", goal: "buildMuscle" },
  { id: 5, name: "Chest Fly", image: "...", sets: 3, reps: 15, description: "...", goal: "stayFit" },
  { id: 6, name: "Incline Push-Ups", image: "...", sets: 3, reps: 20, description: "...", goal: "stayFit" },
  { id: 7, name: "Dumbbell Pullover", image: "...", sets: 3, reps: 15, description: "...", goal: "stayFit" },
  { id: 8, name: "Knee Push-Ups", image: "...", sets: 3, reps: 20, description: "...", goal: "stayFit" },
  { id: 9, name: "Push Ups", image: "...", sets: 3, reps: 20, description: "...", goal: "loseWeight" },
  { id: 10, name: "Burpees", image: "...", sets: 3, reps: 15, description: "...", goal: "loseWeight" },
  { id: 11, name: "Mountain Climbers", image: "...", sets: 3, reps: 45, description: "...", goal: "loseWeight" },
  { id: 12, name: "Incline Push-Ups (Fast Reps)", image: "...", sets: 3, reps: 25, description: "...", goal: "loseWeight" }
]; // (Data ... kari nakhyo chhe)

// Abs Workouts Static Data
const absWorkouts = [
  { id: 1, name: "Crunches", image: "...", sets: 3, reps: 20, description: "...", goal: "loseWeight" },
  { id: 2, name: "Russian Twists", image: "...", sets: 3, reps: 20, description: "...", goal: "loseWeight" },
  { id: 3, name: "Mountain Climbers", image: "...", sets: 3, reps: 45, description: "...", goal: "loseWeight" },
  { id: 4, name: "Flutter Kicks", image: "...", sets: 3, reps: 30, description: "...", goal: "loseWeight" },
  { id: 5, name: "Leg Raises", image: "...", sets: 3, reps: 15, description: "...", goal: "stayFit" },
  { id: 6, name: "Plank", image: "...", sets: 3, reps: 60, description: "...", goal: "stayFit" },
  { id: 7, name: "Side Plank", image: "...", sets: 3, reps: 30, description: "...", goal: "stayFit" },
  { id: 8, name: "Seated Knee Tucks", image: "...", sets: 3, reps: 20, description: "...", goal: "stayFit" },
  { id: 9, name: "Cable Crunch", image: "...", sets: 4, reps: 12, description: "...", goal: "buildMuscle" },
  { id: 10, name: "Weighted Sit-Ups", image: "...", sets: 4, reps: 15, description: "...", goal: "buildMuscle" },
  { id: 11, name: "Hanging Leg Raises", image: "...", sets: 4, reps: 12, description: "...", goal: "buildMuscle" },
  { id: 12, name: "Ab Rollouts", image: "...", sets: 4, reps: 10, description: "...", goal: "buildMuscle" }
]; // (Data ... kari nakhyo chhe)

// Back Workouts Static Data
const backWorkouts = [
  { id: 1, name: "Bent Over Row", image: "...", sets: 4, reps: 10, description: "...", goal: "buildMuscle" },
  { id: 2, name: "Deadlift", image: "...", sets: 4, reps: 8, description: "...", goal: "buildMuscle" },
  { id: 3, name: "Seated Cable Row", image: "...", sets: 3, reps: 12, description: "...", goal: "buildMuscle" },
  { id: 4, name: "T-Bar Row", image: "...", sets: 3, reps: 10, description: "...", goal: "buildMuscle" },
  { id: 5, name: "Lat Pulldown", image: "...", sets: 3, reps: 12, description: "...", goal: "stayFit" },
  { id: 6, name: "Superman Hold", image: "...", sets: 3, reps: 45, description: "...", goal: "stayFit" },
  { id: 7, name: "Resistance Band Row", image: "...", sets: 3, reps: 15, description: "...", goal: "stayFit" },
  { id: 8, name: "Back Extensions", image: "...", sets: 3, reps: 15, description: "...", goal: "stayFit" },
  { id: 9, name: "Pull Ups", image: "...", sets: 3, reps: 8, description: "...", goal: "loseWeight" },
  { id: 10, name: "Inverted Rows", image: "...", sets: 3, reps: 12, description: "...", goal: "loseWeight" },
  { id: 11, name: "High Knees to Pull", image: "...", sets: 3, reps: 45, description: "...", goal: "loseWeight" },
  { id: 12, name: "Plank Rows", image: "...", sets: 3, reps: 20, description: "...", goal: "loseWeight" }
]; // (Data ... kari nakhyo chhe)


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
    const normalizedGoal = normalizeGoal(goal); // Sudharo
    const filtered = workouts.filter(
      w => normalizeGoal(w.goal) === normalizedGoal // Sudharo
    );
    return res.json(filtered);
  }
  res.json(workouts);
});

// ✅ LEGS
app.get('/api/workouts/legs', (req, res) => {
  const goal = req.query.goal;
  if (goal) {
    const normalizedGoal = normalizeGoal(goal); // Sudharo
    const filtered = legsWorkouts.filter(
      w => normalizeGoal(w.goal) === normalizedGoal // Sudharo
    );
    return res.json(filtered);
  }
  res.json(legsWorkouts);
});

// ✅ CHEST
app.get('/api/workouts/chest', (req, res) => {
  const goal = req.query.goal;
  if (goal) {
    const normalizedGoal = normalizeGoal(goal); // Sudharo
    const filtered = chestWorkouts.filter(
      w => normalizeGoal(w.goal) === normalizedGoal // Sudharo
    );
    return res.json(filtered);
  }
  res.json(chestWorkouts);
});

// ✅ ABS
app.get('/api/workouts/abs', (req, res) => {
  const goal = req.query.goal;
  if (goal) {
    const normalizedGoal = normalizeGoal(goal); // Sudharo
    const filtered = absWorkouts.filter(
      w => normalizeGoal(w.goal) === normalizedGoal // Sudharo
    );
    return res.json(filtered);
  }
  res.json(absWorkouts);
});

// ✅ BACK
app.get('/api/workouts/back', (req, res) => {
  const goal = req.query.goal;
  if (goal) {
    const normalizedGoal = normalizeGoal(goal); // Sudharo
    const filtered = backWorkouts.filter(
      w => normalizeGoal(w.goal) === normalizedGoal // Sudharo
    );
    return res.json(filtered);
  }
  res.json(backWorkouts);
});

// ✅ ALL CATEGORIES (Filter by goal)
app.get('/api/workouts/filter', (req, res) => {
  const goal = req.query.goal;
  if (!goal) return res.status(400).json({ error: 'Goal is required' });

  const normalizedGoal = normalizeGoal(goal); // Sudharo
  const filtered = [
    ...workouts,
    ...legsWorkouts,
    ...chestWorkouts,
    ...absWorkouts,
    ...backWorkouts,
  ].filter(
    w => normalizeGoal(w.goal) === normalizedGoal // Sudharo
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
// ✅ Keep server awake on Render (Tamaro existing code)
// ---------------------------
app.get("/ping", (req, res) => {
  res.status(200).send("✅ SmartFit2 backend awake and running fine!");
});
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