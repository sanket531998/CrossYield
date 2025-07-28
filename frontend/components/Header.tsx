export default function Header() {
  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          CrossYield
        </h1>
        <nav>
          <ul className="flex space-x-4"></ul>
        </nav>
      </div>
    </header>
  );
}
