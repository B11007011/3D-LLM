import React from 'react';
import { Link } from 'wouter';

interface DemoNavigationProps {
  currentPath?: string;
}

const DemoNavigation: React.FC<DemoNavigationProps> = ({ currentPath = window.location.pathname }) => {
  const links = [
    { path: '/', label: 'Home' },
    { path: '/console', label: 'Console Demo' },
    { path: '/model-loading', label: 'Model Loading Demo' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-700 px-4 py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-white font-bold">3D-LLM Project</div>
        <nav className="flex space-x-4">
          {links.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
            >
              <a 
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentPath === link.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {link.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DemoNavigation; 