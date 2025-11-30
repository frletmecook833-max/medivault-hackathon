import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface-alt border-t border-border mt-12">
      <div className="container-default py-6 text-sm text-text-muted flex justify-between items-center">
        <div>© {new Date().getFullYear()} MediVault</div>
        <div className="flex gap-4">
          <a>Privacy</a>
          <a>Terms</a>
          <a>Contact</a>
        </div>
      </div>
    </footer>
  );
}

