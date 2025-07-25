import React, { useState, useEffect, useRef } from 'react';
import { Upload, Save } from 'lucide-react';

const StoreSettingsView = ({ settings, onSave, isLoading }) => {
  const [formData, setFormData] = useState(settings || {});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(settings?.logo_url || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(settings || {});
    setLogoPreview(settings?.logo_url || null);
  }, [settings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, logoFile);
  };

  return (
    <div className="max-w-4xl mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo Uploader */}
          <div className="md:col-span-1 flex flex-col items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Logo Toko</label>
            <div 
              className="w-40 h-40 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-500 cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Upload size={40} />
                  <p className="text-xs mt-1">Klik untuk unggah</p>
                </div>
              )}
            </div>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/png, image/jpeg"
            />
          </div>

          {/* Form Fields */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Nama Toko</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Alamat</label>
              <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Telepon</label>
              <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Pesan di Struk (Footer)</label>
              <input type="text" name="footer_message" value={formData.footer_message || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t dark:border-gray-700">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-400"
          >
            <Save size={20} />
            <span>{isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreSettingsView;