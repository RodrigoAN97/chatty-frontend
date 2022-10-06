import { addMessage, getAllMessages } from "../controllers/messagesController";

export const messagesRouter = express.Router();

messagesRouter.post("add-message", addMessage);
messagesRouter.post("get-messages", getAllMessages);
