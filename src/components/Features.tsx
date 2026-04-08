import { motion } from "framer-motion";

interface FeatureRowProps {
  title: string;
  description: string;
  reversed?: boolean;
}

const FeatureRow = ({ title, description, reversed }: FeatureRowProps) => (
  <div className="py-12 md:py-20 border-t-8 border-[hsl(0,0%,13%)]">
    <div
      className={`max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col ${
        reversed ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-8 md:gap-16`}
    >
      <motion.div
        initial={{ opacity: 0, x: reversed ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="flex-1 text-center md:text-left"
      >
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 leading-tight">
          {title}
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: reversed ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 flex items-center justify-center"
      >
        <div className="w-full max-w-[420px] aspect-video rounded-lg bg-card border border-border flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Preview</span>
        </div>
      </motion.div>
    </div>
  </div>
);

const features: FeatureRowProps[] = [
  {
    title: "Enjoy on your TV",
    description:
      "Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.",
  },
  {
    title: "Download your shows to watch offline",
    description:
      "Save your favorites easily and always have something to watch.",
    reversed: true,
  },
  {
    title: "Watch everywhere",
    description:
      "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.",
  },
  {
    title: "Create profiles for kids",
    description:
      "Send kids on adventures with their favorite characters in a space made just for them — free with your membership.",
    reversed: true,
  },
];

const Features = () => (
  <section>
    {features.map((f, i) => (
      <FeatureRow key={i} {...f} />
    ))}
  </section>
);

export default Features;
