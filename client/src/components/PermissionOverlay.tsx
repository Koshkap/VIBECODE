interface PermissionOverlayProps {
  isOpen: boolean;
  onRequestPermissions: () => void;
}

export default function PermissionOverlay({ isOpen, onRequestPermissions }: PermissionOverlayProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50 fadeIn">
      <div className="bg-[#1E1E1E] p-6 rounded-xl max-w-xs mx-4">
        <h2 className="text-xl font-bold mb-3">Permissions Required</h2>
        <p className="mb-4 text-[#ABABAB]">
          This app needs access to your location and device orientation to function properly.
        </p>
        <button 
          className="w-full bg-[#007AFF] text-white font-bold py-2 px-4 rounded-lg mb-2 button-press"
          onClick={onRequestPermissions}
        >
          Enable Access
        </button>
      </div>
    </div>
  );
}
