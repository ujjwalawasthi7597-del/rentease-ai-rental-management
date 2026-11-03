import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { dbStore } from '../models/store.js';

export const getProperties = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let properties: any[] = [];

    if (user.role === 'landlord') {
      properties = await dbStore.properties.find({ landlordId: user._id });
    } else {
      // If tenant, find the tenant record linked to this user
      const tenant = await dbStore.tenants.findOne({ email: user.email }) ||
                     await dbStore.tenants.findOne({ userId: user._id });
      if (tenant && tenant.propertyId) {
        const prop = await dbStore.properties.findById(tenant.propertyId);
        if (prop) properties = [prop];
      }
    }

    res.json({ success: true, count: properties.length, data: properties });
  } catch (err: any) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve properties.' });
  }
};

export const getPropertyById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await dbStore.properties.findById(id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    // Role security check
    if (req.user!.role === 'landlord' && property.landlordId !== req.user!._id) {
      res.status(403).json({ success: false, message: 'Access denied to this property.' });
      return;
    }

    res.json({ success: true, data: property });
  } catch (err: any) {
    console.error('Error fetching property by ID:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve property details.' });
  }
};

export const createProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const {
      propertyName,
      propertyType,
      address,
      city,
      monthlyRent,
      bedrooms,
      bathrooms,
      description,
      image,
      availabilityStatus,
      amenities,
    } = req.body;

    if (!propertyName || !address || !city || monthlyRent === undefined) {
      res.status(400).json({
        success: false,
        message: 'Property name, address, city, and monthly rent are required.',
      });
      return;
    }

    const defaultImages = [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    ];
    const chosenImage = image && image.trim() !== '' ? image.trim() : defaultImages[Math.floor(Math.random() * defaultImages.length)];

    const newProperty = await dbStore.properties.create({
      landlordId: user._id,
      propertyName: propertyName.trim(),
      propertyType: propertyType || 'Apartment',
      address: address.trim(),
      city: city.trim(),
      monthlyRent: Number(monthlyRent),
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      description: description?.trim() || '',
      image: chosenImage,
      availabilityStatus: availabilityStatus || 'Available',
      amenities: Array.isArray(amenities) ? amenities : ['High-Speed WiFi', 'Air Conditioning'],
    });

    res.status(201).json({
      success: true,
      message: 'Property created successfully!',
      data: newProperty,
    });
  } catch (err: any) {
    console.error('Error creating property:', err);
    res.status(500).json({ success: false, message: 'Failed to create property.' });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await dbStore.properties.findById(id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    if (property.landlordId !== req.user!._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to modify this property.' });
      return;
    }

    const {
      propertyName,
      propertyType,
      address,
      city,
      monthlyRent,
      bedrooms,
      bathrooms,
      description,
      image,
      availabilityStatus,
      amenities,
    } = req.body;

    const updates: any = {};
    if (propertyName) updates.propertyName = propertyName.trim();
    if (propertyType) updates.propertyType = propertyType;
    if (address) updates.address = address.trim();
    if (city) updates.city = city.trim();
    if (monthlyRent !== undefined) updates.monthlyRent = Number(monthlyRent);
    if (bedrooms !== undefined) updates.bedrooms = Number(bedrooms);
    if (bathrooms !== undefined) updates.bathrooms = Number(bathrooms);
    if (description !== undefined) updates.description = description;
    if (image) updates.image = image;
    if (availabilityStatus) updates.availabilityStatus = availabilityStatus;
    if (amenities) updates.amenities = amenities;

    const updated = await dbStore.properties.findByIdAndUpdate(id, updates);

    res.json({
      success: true,
      message: 'Property updated successfully!',
      data: updated,
    });
  } catch (err: any) {
    console.error('Error updating property:', err);
    res.status(500).json({ success: false, message: 'Failed to update property.' });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const property = await dbStore.properties.findById(id);

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found.' });
      return;
    }

    if (property.landlordId !== req.user!._id) {
      res.status(403).json({ success: false, message: 'Unauthorized to delete this property.' });
      return;
    }

    await dbStore.properties.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Property deleted successfully.',
    });
  } catch (err: any) {
    console.error('Error deleting property:', err);
    res.status(500).json({ success: false, message: 'Failed to delete property.' });
  }
};
