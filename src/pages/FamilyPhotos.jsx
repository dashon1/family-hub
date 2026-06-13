import React, { useState, useEffect } from 'react';
import { FamilyPhoto, User } from '@/api/entities';
import { UploadFile } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Camera, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import PhotoUploadForm from '../components/photos/PhotoUploadForm';
import PhotoGallery from '../components/photos/PhotoGallery';

export default function FamilyPhotos() {
  const [photos, setPhotos] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadPhotos = async () => {
    setIsLoading(true);
    const fetchedPhotos = await FamilyPhoto.list('-created_date');
    setPhotos(fetchedPhotos);
    setIsLoading(false);
  };

  const handlePhotoUpload = async (photoData) => {
    await FamilyPhoto.create({
      ...photoData,
      uploaded_by: user?.email,
      household_id: user?.household_id
    });
    setShowUploadForm(false);
    loadPhotos();
  };

  const handleDeletePhoto = async (photoId) => {
    await FamilyPhoto.delete(photoId);
    loadPhotos();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Family Photos
            </h1>
            <p className="text-gray-600 mt-2">Share special moments with your family</p>
          </div>
          <Button 
            onClick={() => setShowUploadForm(true)}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Upload Photo
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : photos.length === 0 ? (
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No photos yet</h3>
              <p className="text-gray-500">Upload your first family photo to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <PhotoGallery photos={photos} onDelete={handleDeletePhoto} />
        )}

        <AnimatePresence>
          {showUploadForm && (
            <PhotoUploadForm
              onSubmit={handlePhotoUpload}
              onCancel={() => setShowUploadForm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}