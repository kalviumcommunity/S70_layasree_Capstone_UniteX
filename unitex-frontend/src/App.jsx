import React from 'react';

const App = () => {
  return (
    <div className="flex min-h-screen bg-[#f5f5f5] text-black">
      {/* Sidebar */}
      <aside className="w-20 bg-gray-300 flex flex-col items-center py-4 space-y-6">
        <img src="logo.jpg" alt="UniteX Logo" className="w-12 h-12" />
        <SidebarIcon icon="🏠" />
        <SidebarIcon icon="📅" />
        <SidebarIcon icon="💬" />
        <SidebarIcon icon="⚙️" />
        <SidebarIcon icon="👤" />
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Unite<span className="font-extrabold">X</span></h1>
          <input
            type="text"
            placeholder="Search text"
            className="-ml-10 px-4 py-2 rounded-full bg-[#eee] text-sm focus:outline-none"
          />
        </div>

        {/* Upcoming Events Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-medium mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-4 gap-6">
            <Card title="Calendar" />
            <Card title="Live - Chatting" />
            <Card title="Organizers details" />
            <Card title="Event Listing" />
          </div>
        </section>

        {/* Direct Contact Section */}
        <section className="bg-gray-300 p-10 rounded-md min-h-[300px]">
          <p className="text-lg font-medium">Direct contact for private booking</p>
        </section>
      </div>
    </div>
  );
};

const SidebarIcon = ({ icon }) => (
  <div className="text-2xl cursor-pointer hover:scale-110 transition">{icon}</div>
);

const Card = ({ title }) => (
  <div className="bg-gray-200 p-8 rounded-md shadow-sm min-h-[200px]">
    <h3 className="font-semibold mb-4 text-lg">{title}</h3>
    <div className="space-y-2 text-sm text-gray-600">
    </div>
  </div>
);

export default App;
