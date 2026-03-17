const StatsSection = () => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "10K+", label: "Active Students" },
            { number: "50+", label: "Expert Courses" },
            { number: "1000+", label: "Video Hours" },
            { number: "4.9", label: "User Rating" },
          ].map((stat, i) => (
            <div key={i} className="hover:scale-105 transition">
              <h3 className="text-4xl font-extrabold text-gray-900 mb-1">
                {stat.number}
              </h3>
              <p className="text-gray-500 text-sm uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
