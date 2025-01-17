// awards.js
import {
  FaMedal,
  FaRegSmile,
  FaHeart,
  FaHandsHelping,
  FaLightbulb,
  FaRunning,
} from "react-icons/fa";

export const AWARDS = [
  {
    id: "most_obedient",
    name: "Most Obedient",
    description: "Awarded for exceptional discipline and reliability.",
    Icon: FaMedal,
  },
  {
    id: "most_positive",
    name: "Most Positive",
    description: "Awarded for spreading positivity and good vibes.",
    Icon: FaRegSmile,
  },
  {
    id: "most_caring",
    name: "Most Caring",
    description: "Awarded for showing great empathy and kindness.",
    Icon: FaHeart,
  },
  {
    id: "best_team_player",
    name: "Best Team Player",
    description: "Awarded for outstanding collaboration and support.",
    Icon: FaHandsHelping,
  },
  {
    id: "most_innovative",
    name: "Most Innovative",
    description: "Awarded for bringing creative ideas and solutions.",
    Icon: FaLightbulb,
  },
  {
    id: "most_active",
    name: "Most Active",
    description: "Awarded for consistent participation and enthusiasm.",
    Icon: FaRunning,
  },
];

export default AWARDS;
