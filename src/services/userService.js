import api from '../utils/api';

/**
 * Fetches all users from the API
 * @returns {Promise} Promise object with user data
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Creates a new user with form data support for file uploads
 * @param {Object|FormData} userData - The user data including possible file uploads
 * @returns {Promise} Promise object with created user data
 */
export const createUser = async (userData) => {
  try {
    console.log('Creating user with data:', userData instanceof FormData ? 'FormData object' : userData);
    
    let formData;
    
    // Check if userData is already FormData
    if (userData instanceof FormData) {
      formData = userData;
      console.log('Using provided FormData directly');
      
      // Special handling for role='user' which causes backend validation errors
      if (formData.get('role') === 'user') {
        console.log('WARNING: Detected role="user" which might cause validation issues');
        
        // Get the current value and create a modified form data
        const currentRole = formData.get('role');
        // Replace with an explicitly formatted role value
        formData.set('role', 'user'); // Ensure consistency
      }
    } else {
      // Create a new FormData object
      formData = new FormData();
      
      // Append all user data to FormData
      Object.keys(userData).forEach(key => {
        // Skip null, undefined, or empty values except for falsy values like '0' or false
        if (userData[key] === null || userData[key] === undefined || userData[key] === '') {
          return;
        }
        
        // Special handling for role='user'
        if (key === 'role' && userData[key] === 'user') {
          console.log('Setting role to "user" - this may cause validation issues on the backend');
          formData.append(key, userData[key]);
        }
        // For files, append directly
        else if (key === 'profilePicture' && userData[key] instanceof File) {
          console.log('Appending file:', key, userData[key].name);
          formData.append(key, userData[key]);
        } else {
          // For other data, stringify objects if needed
          const value = typeof userData[key] === 'object' && !(userData[key] instanceof File)
            ? JSON.stringify(userData[key])
            : userData[key];
          
          console.log('Appending field:', key, value);
          formData.append(key, value);
        }
      });
    }
    
    // For debugging - log all FormData entries
    console.log('FormData contents:');
    const formDataEntries = [];
    for (let pair of formData.entries()) {
      const entryValue = pair[1] instanceof File ? `(File: ${pair[1].name})` : pair[1];
      console.log('FormData contains:', pair[0], entryValue);
      formDataEntries.push(`${pair[0]}: ${entryValue}`);
    }
    
    if (formDataEntries.length === 0) {
      console.error('WARNING: FormData is empty. This will likely cause validation errors.');
    }
    
    // Ensure correct content type handling for FormData
    const config = {
      headers: {
        // Let the browser set the correct content type with boundary for FormData
        'Content-Type': undefined
      }
    };
    
    console.log('Sending request to:', '/users/admin/users');
    const response = await api.post('/users/admin/users', formData, config);
    console.log('User creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Enhance error message with validation details if available
    if (error.response?.data?.validationErrors) {
      const validationErrors = error.response.data.validationErrors
        .map(err => `${err.field}: ${err.message}`)
        .join(', ');
      
      throw new Error(`Validation failed: ${validationErrors}`);
    }
    
    throw error;
  }
};

/**
 * Fetches a user by ID
 * @param {string} id - The user ID
 * @returns {Promise} Promise object with user data
 */
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/admin/users/${id}`);
    
    // Add debugging info for profile picture
    if (response.data && response.data.data) {
      console.log('Profile image data:', {
        hasProfilePicture: !!response.data.data.profilePicture,
        profilePictureURL: response.data.data.profilePicture || 'not set',
        hasAvatar: !!response.data.data.avatar,
        avatarURL: response.data.data.avatar || 'not set'
      });
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

/**
 * Updates a user
 * @param {string} id - The user ID
 * @param {Object|FormData} userData - The user data to update
 * @returns {Promise} Promise object with updated user data
 */
export const updateUser = async (id, userData) => {
  try {
    console.log('Updating user:', id);
    
    let formData;
    // Check if userData is already FormData
    if (userData instanceof FormData) {
      formData = userData;
      console.log('Using provided FormData');
      
      // Log the FormData contents for debugging
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`FormData contains: ${pair[0]} (File: ${pair[1].name}, ${pair[1].size} bytes)`);
        } else {
          console.log(`FormData contains: ${pair[0]} = ${pair[1]}`);
        }
      }
    } else {
      // Create FormData for file upload support if not already FormData
      formData = new FormData();
      
      // Append all user data to FormData
      Object.keys(userData).forEach(key => {
        // Skip null, undefined, or empty values except for falsy values like '0' or false
        if (userData[key] === null || userData[key] === undefined || userData[key] === '') {
          return;
        }
        
        // For files, append directly
        if (key === 'profilePicture' && userData[key] instanceof File) {
          formData.append(key, userData[key]);
          console.log(`Appending file: ${key}, ${userData[key].name}, ${userData[key].size} bytes`);
        } else {
          // For other data, stringify objects if needed
          formData.append(key, typeof userData[key] === 'object' && !(userData[key] instanceof File) 
            ? JSON.stringify(userData[key]) 
            : userData[key]);
          console.log(`Appending field: ${key} = ${userData[key]}`);
        }
      });
    }
    
    // Ensure content type is not set manually for FormData
    const config = {
      headers: {
        'Content-Type': undefined // Let browser set the content type for FormData
      }
    };
    
    console.log('Sending request to API...');
    const response = await api.put(`/users/admin/users/${id}`, formData, config);
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

/**
 * Deletes a user
 * @param {string} id - The user ID
 * @returns {Promise} Promise object with deletion confirmation
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

// Add a test function for user creation
/**
 * Creates a user using the test endpoint
 * @param {Object} userData - The user data including possible file uploads
 * @returns {Promise} Promise object with created user data
 */
export const testCreateUser = async (userData) => {
  try {
    console.log('Starting user creation with test endpoint');
    console.log('Original userData:', userData);
    
    // Create FormData object for supporting file uploads
    const formData = new FormData();
    
    // Append all user data to FormData
    Object.keys(userData).forEach(key => {
      // Skip confirmPassword and null profile picture
      if (key === 'confirmPassword') {
        console.log('Skipping confirmPassword');
        return;
      }
      if (key === 'profilePicture' && !userData[key]) {
        console.log('Skipping null profilePicture');
        return;
      }
      
      // Skip null, undefined, or empty values except for falsy values like '0' or false
      if (userData[key] === null || userData[key] === undefined || userData[key] === '') {
        console.log(`Skipping empty/null field: ${key}`);
        return;
      }
      
      // For files, append directly
      if (key === 'profilePicture' && userData[key] instanceof File) {
        console.log('Appending file:', key, userData[key].name);
        formData.append(key, userData[key]);
      } else {
        // For other data, stringify objects if needed
        const value = typeof userData[key] === 'object' && !(userData[key] instanceof File)
          ? JSON.stringify(userData[key])
          : userData[key];
        
        console.log('Appending field:', key, value);
        formData.append(key, value);
      }
    });
    
    // For debugging - log all FormData entries
    console.log('FormData contents:');
    for (let pair of formData.entries()) {
      console.log('FormData contains:', pair[0], pair[1] instanceof File ? `(File: ${pair[1].name})` : pair[1]);
    }
    
    // Log the endpoint
    console.log('Sending request to:', '/users/test-create');
    
    const response = await api.post('/users/test-create', formData);
    console.log('User creation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating test user:', error);
    console.error('Error response status:', error.response?.status);
    console.error('Error details:', error.response?.data || error.message);
    console.error('Request data sent:', error.config?.data);
    throw error;
  }
}; 