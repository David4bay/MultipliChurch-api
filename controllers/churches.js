const db = require('../db/db')

async function getChurches(_, res) {
    try {
        const churches = await db.asyncAll(`
            SELECT c.id, c.name, c.total_members, u.username AS admin
            FROM churches c
            LEFT JOIN user u ON c.admin_id = u.id
        `)
        return res.status(200).json(churches)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

async function getChurchById(req, res) {
    try {
        const church = await db.asyncGet(`
            SELECT c.id, c.name, c.total_members, u.username AS admin
            FROM churches c
            LEFT JOIN user u ON c.admin_id = u.id
            WHERE c.id = ?
        `, [req.params.id])

        if (!church) {
            return res.status(404).json({ message: 'Church not found' })
        }

        return res.status(200).json(church)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

async function createChurch(req, res) {
    const { name } = req.body
    const admin_id = req.user.id

    if (!name) {
        return res.status(400).json({ message: 'Church name is required' })
    }

    try {
    
    
        const admin = await db.asyncGet(
            'SELECT id FROM user WHERE id = ? AND isAdmin = 1',
            [admin_id]
        )
        if (!admin) {
            return res.status(403).json({ message: 'Admin privileges required' })
        }

        const existing = await db.asyncGet(
            'SELECT id FROM churches WHERE name = ?', [name]
        )
        if (existing) {
            return res.status(400).json({ message: 'A church with that name already exists' })
        }

        const result = await db.asyncRun(
            'INSERT INTO churches (name, admin_id) VALUES (?, ?)',
            [name, admin_id]
        )

        return res.status(201).json({ message: 'Church created successfully', id: result.lastID })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

async function updateChurch(req, res) {
    const { name } = req.body
    const { id } = req.params
    const admin_id = req.user.id

    if (!name) {
        return res.status(400).json({ message: 'Church name is required' })
    }

    try {
        const church = await db.asyncGet(
            'SELECT id, admin_id FROM churches WHERE id = ?', [id]
        )
        if (!church) {
            return res.status(404).json({ message: 'Church not found' })
        }

    
        if (church.admin_id !== admin_id) {
            return res.status(403).json({ message: 'You do not have permission to update this church' })
        }

        await db.asyncRun('UPDATE churches SET name = ? WHERE id = ?', [name, id])

        return res.status(200).json({ message: 'Church updated successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

async function deleteChurch(req, res) {
    const { id } = req.params
    const admin_id = req.user.id

    try {
        const church = await db.asyncGet(
            'SELECT id, admin_id FROM churches WHERE id = ?', [id]
        )
        if (!church) {
            return res.status(404).json({ message: 'Church not found' })
        }

        if (church.admin_id !== admin_id) {
            return res.status(403).json({ message: 'You do not have permission to delete this church' })
        }

    
        await db.asyncRun('DELETE FROM churches WHERE id = ?', [id])

        return res.status(200).json({ message: 'Church deleted successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = { 
    getChurches, 
    getChurchById, 
    createChurch, 
    updateChurch, 
    deleteChurch 
}