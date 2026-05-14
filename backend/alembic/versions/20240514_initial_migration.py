"""Initial migration

Revision ID: 20240514_initial
Revises: 
Create Date: 2024-05-14 18:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20240514_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('username', sa.String(length=100), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('admin', 'doctor', 'nurse', name='userrole'), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)

    # Create patients table
    op.create_table(
        'patients',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('first_name', sa.String(length=100), nullable=False),
        sa.Column('last_name', sa.String(length=100), nullable=False),
        sa.Column('date_of_birth', sa.DateTime(), nullable=False),
        sa.Column('gender', sa.String(length=20), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('medical_history', sa.Text(), nullable=True),
        sa.Column('allergies', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_patients_id'), 'patients', ['id'], unique=False)

    # Create vitals table
    op.create_table(
        'vitals',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('patient_id', sa.Integer(), nullable=False),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('sex', sa.Integer(), nullable=False),
        sa.Column('cp', sa.Integer(), nullable=False),
        sa.Column('trestbps', sa.Integer(), nullable=False),
        sa.Column('chol', sa.Integer(), nullable=False),
        sa.Column('fbs', sa.Integer(), nullable=False),
        sa.Column('restecg', sa.Integer(), nullable=False),
        sa.Column('thalach', sa.Integer(), nullable=False),
        sa.Column('exang', sa.Integer(), nullable=False),
        sa.Column('oldpeak', sa.Float(), nullable=False),
        sa.Column('slope', sa.Integer(), nullable=False),
        sa.Column('ca', sa.Integer(), nullable=False),
        sa.Column('thal', sa.Integer(), nullable=False),
        sa.Column('recorded_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('notes', sa.String(length=500), nullable=True),
        sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_vitals_id'), 'vitals', ['id'], unique=False)

    # Create predictions table
    op.create_table(
        'predictions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('patient_id', sa.Integer(), nullable=False),
        sa.Column('vitals_id', sa.Integer(), nullable=False),
        sa.Column('risk_probability', sa.Float(), nullable=False),
        sa.Column('confidence_score', sa.Float(), nullable=False),
        sa.Column('risk_level', sa.String(length=20), nullable=False),
        sa.Column('contributing_factors', sa.JSON(), nullable=False),
        sa.Column('prediction_date', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['patient_id'], ['patients.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['vitals_id'], ['vitals.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_predictions_id'), 'predictions', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_predictions_id'), table_name='predictions')
    op.drop_table('predictions')
    op.drop_index(op.f('ix_vitals_id'), table_name='vitals')
    op.drop_table('vitals')
    op.drop_index(op.f('ix_patients_id'), table_name='patients')
    op.drop_table('patients')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
