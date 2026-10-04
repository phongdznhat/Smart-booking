const {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource
} = require('../service/ResourceService');

const getResourceListPage = async (req, res) => {
    try {
        const resources = await getAllResources();
        return res.render('resourceList.ejs', { resources });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

const getCreateResourcePage = (req, res) => {
    return res.render('resourceCreate.ejs');
};

const postCreateResource = async (req, res) => {
    try {
        const { name, description, type, price } = req.body;
        const imageUrl = req.file ? `/image/${req.file.filename}` : null;
        
        await createResource({
            Name: name,
            Description: description,
            Type: type,
            Price: price || 0,
            Status: 'available',
            ImageUrl: imageUrl
        });
        return res.redirect('/admin/resources');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

const getEditResourcePage = async (req, res) => {
    try {
        const resource = await getResourceById(req.params.id);
        return res.render('resourceEdit.ejs', { resource });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

const postUpdateResource = async (req, res) => {
    try {
        const { id, name, description, type, price, status } = req.body;
        const updateData = {
            Name: name,
            Description: description,
            Type: type,
            Price: price || 0,
            Status: status
        };
        if (req.file) {
            updateData.ImageUrl = `/image/${req.file.filename}`;
        }
        await updateResource(id, updateData);
        return res.redirect('/admin/resources');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

const postDeleteResource = async (req, res) => {
    try {
        const { id } = req.body;
        await deleteResource(id);
        return res.redirect('/admin/resources');
    } catch (error) {
        console.error(error);
        return res.status(500).send('Lỗi server');
    }
};

module.exports = {
    getResourceListPage,
    getCreateResourcePage,
    postCreateResource,
    getEditResourcePage,
    postUpdateResource,
    postDeleteResource
};
