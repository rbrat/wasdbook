from fastapi import HTTPException, status

class NotFoundHTTPException(HTTPException):
    def __init__(self, model_name, **kwargs) -> None:
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=f'{model_name} not found', **kwargs)

class NoteNotFoundHTTPException(NotFoundHTTPException):
    def __init__(self, **kwargs) -> None:
        super().__init__('Note', **kwargs)

class UserNotFoundHTTPException(NotFoundHTTPException):
    def __init__(self, **kwargs) -> None:
        super().__init__('User', **kwargs)

class IncorrectCredentialsHTTPException(HTTPException):
    def __init__(self, **kwargs) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail='Incorrect username or password', **kwargs)

class ForbiddenHTTPException(HTTPException):
    def __init__(self, operation_name, **kwargs) -> None:
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=f'Could not {operation_name} unowned note', **kwargs)

class ReadForbiddenHTTPException(ForbiddenHTTPException):
    def __init__(self, **kwargs) -> None:
        super().__init__('read', **kwargs)

class UpdateForbiddenHTTPException(ForbiddenHTTPException):
    def __init__(self, **kwargs) -> None:
        super().__init__('update', **kwargs)

class DeleteForbiddenHTTPException(ForbiddenHTTPException):
    def __init__(self, **kwargs) -> None:
        super().__init__('delete', **kwargs)

class InactiveUserHTTPException(HTTPException):
    def __init__(self, **kwargs) -> None:
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail='Inactive user', **kwargs)

class UserExistsHTTPException(HTTPException):
    def __init__(self, field_name, **kwargs) -> None:
        super().__init__(status_code=status.HTTP_400_BAD_REQUEST, detail=f'{field_name} already occupied', **kwargs)

class UserForbiddenHTTPException(HTTPException):
    def __init__(self, operation, **kwargs) -> None:
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=f'Could not {operation} another user', **kwargs)

class EnvironmentError(Exception):
    def __init__(self, env_name, *args) -> None:
        super().__init__(*args)
        self.detail = f'{env_name} not found in local environment'