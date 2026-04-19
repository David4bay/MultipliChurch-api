const db = require("../db/db")

async function getMembers(req, res) {
    const { churchId } = req.params

    try {
        const church = await db.asyncGet("SELECT id FROM churches WHERE id = ?", [churchId])
        if (!church) {
            return res.status(404).json({ message: "Church not found" })
        }

    
        const members = await db.asyncAll(`
            SELECT m.id, u.id AS user_id, u.username, u.isAdmin
            FROM members m
            JOIN user u ON m.user_id = u.id
            WHERE m.church_id = ?
        `, [churchId])

        console.log("data from getMembers result", members)
        return res.status(200).json(members)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function getMemberById(req, res) {
    const { churchId, id } = req.params

    try {
        const member = await db.asyncGet(`
            SELECT m.id, u.id AS user_id, u.username, u.isAdmin, m.church_id
            FROM members m
            JOIN user u ON m.user_id = u.id
            WHERE m.id = ? AND m.church_id = ?
        `, [id, churchId])

        if (!member) {
            return res.status(404).json({ message: "Member not found" })
        }

        console.log("call to getMemberById result", member)
        return res.status(200).json(member)
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function createMember(req, res) {
    const { churchId } = req.params
    const { user_id } = req.body

    if (!user_id) {
        return res.status(400).json({ message: "user_id is required" })
    }

    try {
        const church = await db.asyncGet("SELECT id FROM churches WHERE id = ?", [churchId])
        if (!church) {
            return res.status(404).json({ message: "Church not found" })
        }

    
        const user = await db.asyncGet("SELECT id FROM user WHERE id = ?", [user_id])
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

    
        const alreadyMember = await db.asyncGet(
            "SELECT id FROM members WHERE user_id = ? AND church_id = ?",
            [user_id, churchId]
        )
        if (alreadyMember) {
            return res.status(400).json({ message: "User is already a member of this church" })
        }

    
        const result = await db.asyncRun(
            "INSERT INTO members (user_id, church_id) VALUES (?, ?)",
            [user_id, churchId]
        )
        console.log("call to create member result", result)
        return res.status(201).json({ message: "Member added successfully", id: result.lastID })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function updateMember(req, res) {
    const { churchId, id } = req.params
    const { new_church_id } = req.body

    if (!new_church_id) {
        return res.status(400).json({ message: "new_church_id is required" })
    }

    try {
        const member = await db.asyncGet(
            "SELECT id FROM members WHERE id = ? AND church_id = ?",
            [id, churchId]
        )
        if (!member) {
            return res.status(404).json({ message: "Member not found" })
        }

        const targetChurch = await db.asyncGet(
            "SELECT id FROM churches WHERE id = ?", [new_church_id]
        )
        if (!targetChurch) {
            return res.status(404).json({ message: "Target church not found" })
        }

    
        await db.asyncRun(
            "UPDATE members SET church_id = ? WHERE id = ?",
            [new_church_id, id]
        )

        return res.status(200).json({ message: "Member updated successfully" })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function removeMember(req, res) {
    const { churchId, id } = req.params

    try {
        const member = await db.asyncGet(
            "SELECT id FROM members WHERE id = ? AND church_id = ?",
            [id, churchId]
        )

        if (req.user.id !== member.id) {
            return res.status(401).json({ message: "user not permitted to delete member."})
        }

        if (!member) {
            return res.status(404).json({ message: "Member not found" })
        }

    
        await db.asyncRun("DELETE FROM members WHERE id = ?", [id])

        
        return res.status(200).json({ message: "Member removed successfully" })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { 
    getMembers, 
    getMemberById, 
    createMember, 
    updateMember, 
    removeMember 
}