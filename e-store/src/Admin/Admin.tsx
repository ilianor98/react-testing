import React, { useState } from 'react';
import AddProductForm from './AddProductForm';
import DeleteProductForm from './DeleteProductForm';

const Admin: React.FC = () => {
    const [showAddProductForm, setShowAddProductForm] = useState(false);
    const [showDeleteProductForm, setShowDeleteProductForm] = useState(false);

    const handleAddProductClick = () => {
        setShowAddProductForm(true);
    };

    const handleCloseAddProductForm = () => {
        setShowAddProductForm(false);
    };

    const handleDeleteProductClick = () => {
        setShowDeleteProductForm(true);
    };

    const handleCloseDeleteProductForm = () => {
        setShowDeleteProductForm(false);
    };

    return (
        <div>
            <h2>Admin Panel</h2>
            <button onClick={handleAddProductClick}>Add Product</button>
            {showAddProductForm && <AddProductForm onClose={handleCloseAddProductForm} />}
            <button>Edit Product</button>
            <button onClick={handleDeleteProductClick}>Delete Product</button>
            {showDeleteProductForm && <DeleteProductForm onClose={handleCloseDeleteProductForm} />}
            {/* You can add more buttons or functionality here */}
        </div>
    );
};

export default Admin;
