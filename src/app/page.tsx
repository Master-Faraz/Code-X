export default function Home() {
  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      {/* Navbar */}
      <header className="h-[5vh] flex items-center justify-between px-6 bg-white shadow-md">
        <div className="text-xl font-bold">BrandLogo</div>
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <a href="#" className="hover:text-blue-600">
            Home
          </a>
          <a href="#" className="hover:text-blue-600">
            Features
          </a>
          <a href="#" className="hover:text-blue-600">
            Pricing
          </a>
          <a href="#" className="hover:text-blue-600">
            Contact
          </a>
        </nav>
        <button className="md:hidden">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Hero */}
      <section className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-white px-6">
        <div className="max-w-4xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Build Smarter, Ship Faster
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Professional solutions for modern businesses. Crafted with precision
            and style.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {[
              ["Fast Performance", "Optimized code for blazing speed."],
              ["Responsive Design", "Looks great on any device."],
              ["Modern Stack", "Built with modern tools and best practices."],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="p-6 border rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="text-xl font-medium mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-10">What our users say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              ["“Absolutely amazing experience.”", "– Alex J., CEO"],
              ["“The best UI framework I’ve used.”", "– Sam R., Developer"],
            ].map(([quote, author], i) => (
              <div key={i} className="bg-white p-6 rounded-lg border shadow">
                <p className="text-lg font-medium">{quote}</p>
                <p className="text-sm text-gray-500 mt-3">{author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-white text-center text-sm">
        <p>&copy; {new Date().getFullYear()} BrandName. All rights reserved.</p>
      </footer>
    </div>
  );
}
