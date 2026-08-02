from fastapi import APIRouter
from pydantic import BaseModel

from dispatcher import execute_command

router = APIRouter()


class Command(BaseModel):
    action: str
    target: str


@router.post("/command")
def command(cmd: Command):
    return execute_command(cmd.action, cmd.target)