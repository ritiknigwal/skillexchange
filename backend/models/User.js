import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    city: {
        type: String,
        default: 'Indore'
    },

    bio: {
        type: String,
        default: ''
    },

    offers: {
        type: [String],
        default: []
    },

    needs: {
        type: [String],
        default: []
    },

    isPremium: {
        type: Boolean,
        default: false
    },

    peerId: {
        type: String,
        default: null
    }
},
{
    timestamps: true
}
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);