var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { stringify } = require('jade/lib/utils');

router.get('/get-all', async function (req, res, next) {
    const tasks = await prisma.task.findMany({
        where: {
            is_deleted : false
        }
    });
    
    res.send(tasks)
});

router.get('/get-task/:id', async function (req, res, next) {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
        where: {
            id: parseInt(id),
        },
    });
    res.send(task)
});

router.post('/create', async function (req, res, next) {

    const { title, desc, priority, created_by, deadline, is_done } = req.body;

    const parsedDeadline = new Date(deadline);
    if (parsedDeadline.getTime() !== parsedDeadline.getTime()) {
        return res.status(400).json({ error: "Invalid deadline format" });
    }
    const task = await prisma.task.create({
        data: {
            title,
            desc,
            priority,
            created_by,
            deadline: parsedDeadline,
            is_done: is_done !== undefined ? Boolean(is_done) : false
    
        },
    });
    res.send(task);
});

router.put('/update/:id', async function (req, res, next) {
    const { id } = req.params;
    const { title, desc, priority, created_by, deadline, is_done } = req.body;
    const parsedDeadline = new Date(deadline);

    const task = await prisma.task.update({
        where: {
            id: parseInt(id),
        },
        data: {
            title,
            desc,
            priority,
            created_by,
            deadline: parsedDeadline,
            is_done: is_done !== undefined ? Boolean(is_done) : false
        }
    });
    res.status(200).json({ message: '--Successfully Updated--', task})
}); 

router.delete('/delete/:id', async function (req, res, next) {
    const { id } = req.params;
    const task = await prisma.task.update({
        where: {
            id: parseInt(id),
        },
        data: {
            deleted_at : new Date(),
            is_deleted : true
        }
    });
    res.status(200).json({ message: '--Successfully Deleted--', task})
});


module.exports = router;
