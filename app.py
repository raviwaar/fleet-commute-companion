import streamlit as st
import random

st.title("🚲 Fleet Commute Companion — Smart, Social, Rewarding")

# --- User Inputs ---
mode = st.selectbox("Select your commute mode:", ["Bike", "Public Transit", "Carpool", "Solo Car"])
distance = st.number_input("Distance traveled (meters):", min_value=0)
people = st.number_input("Number of people commuting together:", min_value=1)

# --- Base Points & Multipliers ---
points_per_100m = {"Bike": 100, "Public Transit": 40, "Carpool": 20, "Solo Car": 1}
multipliers = {"Bike": [1,2,3,4], "Public Transit": [1,1.5,2,2.5], "Carpool":[1,1.2,1.5,2], "Solo Car":[1,1,1,1.2]}
group_index = min(people,4)-1
multiplier = multipliers[mode][group_index]

# --- Points Calculation ---
base_points = (distance/100)*points_per_100m[mode]
total_points = int(base_points*multiplier)

st.success(f"Points earned: {total_points} (Base: {int(base_points)}, Multiplier: x{multiplier})")

# --- Puzzle / Quiz Unlock ---
puzzles = [
    "🧩 Solve: I speak without a mouth and hear without ears. What am I?",
    "🔤 Wordle: Guess the 5-letter word related to travel.",
    "❓ Quiz: Which is the most eco-friendly mode of commuting?",
    "🧠 Riddle: The more you take, the more you leave behind. What am I?",
    "🎯 Challenge: Name 3 ways to reduce your carbon footprint during commutes."
]
st.write("🚀 Commute Puzzle / Quiz")
st.info(random.choice(puzzles))

# --- Optional: Feedback / Reinforcement ---
st.caption("💡 Your points and puzzles reinforce sustainable and social commuting habits.")

