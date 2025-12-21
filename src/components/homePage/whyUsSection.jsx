import { CheckCircle } from "lucide-react";

const WhyUsSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&w=1471&q=80"
          className="rounded-2xl shadow-2xl lg:w-1/2"
          alt="Students Learning"
        />

        <div className="lg:w-1/2">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why Choose Us?
          </h2>

          <p className="text-gray-600 mb-8">
            We make learning simple, interactive, and designed for your success.
          </p>

          {[
            "Learn at your own pace",
            "Expert instructors",
            "Practical projects",
            "High-quality videos",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3 mb-4">
              <CheckCircle className="text-green-600 flex-shrink-0" />
              <p className="text-gray-700">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
