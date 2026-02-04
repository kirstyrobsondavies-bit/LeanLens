export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          LeanLens
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Analyze your business processes using Lean Six Sigma methodologies. Get actionable
          insights and personalized automation recommendations.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/assessment"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Start Process Audit
          </a>
          <a
            href="#learn-more"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>

      <section id="learn-more" className="mt-24 max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Describe Your Process</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Answer guided questions about your current workflow, pain points, and goals.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-accent-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get AS-IS Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Receive a detailed breakdown using Lean Six Sigma frameworks and waste
              identification.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Automation Plan</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized automation recommendations based on your tools and technology
              stack.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
