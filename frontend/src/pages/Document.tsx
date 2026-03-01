import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axois from "axios";

const Document = () => {
  const navigate = useNavigate();

  async function createDoc() {
    console.log(localStorage.getItem("token"));

    const docId = await axois.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/doc/create`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    navigate("/editor");
    console.log(docId);
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen px-6">
        <div className="w-full max-w-4xl px-6 py-6 flex flex-col items-start p-5 m-2">
          <div className="flex flex-col items-start gap-4 w-full self-start">
            <div className="text-lg font-medium">Start a new document</div>
            <div className="flex items-center gap-3 ">
              <div className="flex flex-col gap-1">
                <img className="h-40 w-30 border-amber-950" onClick={createDoc} alt="" />
                <div className="">Blank document</div>
              </div>
            </div>
          </div>
          <hr className="my-6 w-full max-w-xl" />
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div>Recent documents</div>
              <div>owned by</div>
            </div>
            <div>
              No text documents yet Select a blank document or choose another template above to get
              started
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Document;
