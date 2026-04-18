const db = require('../db/db')

async function getMembers(req, res) {
    const { churchId } = req.params

    try {
        const church = await db.asyncGet('SELECT id FROM churches WHERE id = ?', [churchId])
        if (!church) {
            return res.status(404).json({ message: 'Church not found' })
        }

        const members = await db.asyncAll(
            'SELECT id, name FROM members WHERE church_id = ?',
            [churchId]
        )

        return res.status(200).json(members)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}


async function getMemberById(req, res) {
    const { churchId, id } = req.params

    try {
        const member = await db.asyncGet(
            'SELECT id, name, church_id FROM members WHERE id = ? AND church_id = ?',
            [id, churchId]
        )

        if (!member) {
            return res.status(404).json({ message: 'Member not found' })
        }

        return res.status(200).json(member)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}


async function createMember(req, res) {
    const { churchId } = req.params
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ message: 'Member name is required' })
    }

    try {
        const church = await db.asyncGet('SELECT id FROM churches WHERE id = ?', [churchId])
        if (!church) {
            return res.status(404).json({ message: 'Church not found' })
        }

        const result = await db.asyncRun(
            'INSERT INTO members (name, church_id) VALUES (?, ?)',
            [name, churchId]
        )

        
        await db.asyncRun(
            'UPDATE churches SET total_members = total_members + 1 WHERE id = ?',
            [churchId]
        )

        return res.status(201).json({ message: 'Member added successfully', id: result.lastID })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}


async function updateMember(req, res) {
    const { churchId, id } = req.params
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ message: 'Member name is required' })
    }

    try {
        const member = await db.asyncGet(
            'SELECT id FROM members WHERE id = ? AND church_id = ?',
            [id, churchId]
        )

        if (!member) {
            return res.status(404).json({ message: 'Member not found' })
        }

        await db.asyncRun('UPDATE members SET name = ? WHERE id = ?', [name, id])

        return res.status(200).json({ message: 'Member updated successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}


async function removeMember(req, res) {
    const { churchId, id } = req.params

    try {
        const member = await db.asyncGet(
            'SELECT id FROM members WHERE id = ? AND church_id = ?',
            [id, churchId]
        )

        if (!member) {
            return res.status(404).json({ message: 'Member not found' })
        }

        await db.asyncRun('DELETE FROM members WHERE id = ?', [id])

        
        await db.asyncRun(
            'UPDATE churches SET total_members = MAX(0, total_members - 1) WHERE id = ?',
            [churchId]
        )

        return res.status(200).json({ message: 'Member removed successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = { 
    getMembers, 
    getMemberById, 
    createMember, 
    updateMember, 
    removeMember 
}