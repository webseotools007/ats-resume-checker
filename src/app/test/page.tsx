export default function TestPage() {
  return (
    <div className="bg-blue-500 text-white p-8 m-4 rounded-lg">
      <h1 className="text-4xl font-bold mb-4">Test Page</h1>
      <p className="text-lg">If you can see this styled content, Tailwind CSS is working!</p>
      <div className="mt-4 p-4 bg-red-500 rounded">
        <p>This should be a red box with white text</p>
      </div>
    </div>
  );
}