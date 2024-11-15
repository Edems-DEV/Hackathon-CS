import { Button } from "../ui/Button";
import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div className="p-2 bg-slate-100">
      <p>menu</p>
      <Link to="/runners">
        <Button variant="link">Runners</Button>
      </Link>
      <Link to="/automations">
        <Button variant="link">Automations</Button>
      </Link>
    </div>
  );
}
