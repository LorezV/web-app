// module.exports = (dependencies) => ({
//     async updateBalance(req, res) {
//         const { userId } = req.params;
//         const { amount } = req.body;

//         try {
//             const user = await dependencies.db.User.findByPk(userId);

//             if (!user) {
//                 return res.status(404).json({
//                     error: {
//                         message: "User not found"
//                     }
//                 });
//             }

//             const newBalance = user.balance + amount;

//             if (newBalance < 0) {
//                 return res.status(400).json({
//                     error: {
//                         message: "Balance cannot be negative"
//                     }
//                 })
//             }

//             user.balance = newBalance;
//             await user.save();

//             return res.json({ user });
//         } catch(error) {
//             return res.status(500).json({
//                 error: {
//                     message: "Server error"
//                 }
//             })
//         }
//     }
// })

module.exports = (dependencies) => ({
    async updateBalance(req, res) {
        const { userId } = req.params;
        const { amount } = req.body;

        const t = await dependencies.db.instance.transaction();

        try {
            const user = await dependencies.db.User.findByPk(userId, { transaction: t });

            if (!user) {
                await t.rollback();

                return res.status(404).json({
                    error: {
                        message: "User not found"
                    }
                });
            }

            const newBalance = user.balance + amount;

            if (newBalance < 0) {
                await t.rollback();

                return res.status(400).json({
                    error: {
                        message: "Balance cannot be negative"
                    }
                })
            }

            user.balance = newBalance;
            await user.save({ transaction: t });

            await t.commit();

            return res.json({ user });
        } catch (error) {
            await t.rollback();
            return res.status(500).json({
                error: {
                    message: "Server error"
                }
            })
        }
    }
})