"""Shared FastAPI dependencies for authentication and role checks."""

from fastapi import Depends, HTTPException, status

# Import the existing get_current_user from the auth router
from .api.auth import get_current_user  # noqa: F401

from . import models


def admin_required(current_user: models.User = Depends(get_current_user)):
    """Raise 403 if the current user is not an administrator."""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
