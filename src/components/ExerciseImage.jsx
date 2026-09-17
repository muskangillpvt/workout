import { useState } from "react";
import { Flower2 } from "lucide-react";

const CATEGORY_GRADIENTS = {
  cardio: "from-pink-soft to-lilac-soft",
  posture: "from-lilac-soft to-pink-soft",
  back: "from-pink-soft to-cream-dark",
  strength: "from-lilac-soft to-cream-dark",
  core: "from-pink-soft to-lilac-soft",
  stretch: "from-cream-dark to-pink-soft",
  warmup: "from-lilac-soft to-cream-dark",
};

export default function ExerciseImage({
  src,
  alt,
  category = "strength",
  className = "",
  rounded = "rounded-3xl",
}) {
  const [errored, setErrored] = useState(false);
  const gradient = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.strength;

  if (!src || errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${rounded} ${className}`}
      >
        <Flower2
          className="text-card opacity-70"
          size={44}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`object-cover bg-cream-dark ${rounded} ${className}`}
    />
  );
}
