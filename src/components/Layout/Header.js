const Header = ({ shopName }) => {
  return (
    <header className="bg-white dark:bg-gray-900 p-4 shadow flex justify-between items-center">
      <h1 className="text-lg font-bold text-indigo-600 dark:text-indigo-300">
        {shopName || "Your Shop"}
      </h1>
      <select
        className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
        onChange={(e) => {
          document.documentElement.classList.toggle('dark', e.target.value === 'dark');
        }}
      >
        <option value="light">☀ Light</option>
        <option value="dark">🌙 Dark</option>
      </select>
    </header>
  );
};

export default Header;
