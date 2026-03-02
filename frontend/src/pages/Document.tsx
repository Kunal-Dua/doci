import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import DocBuilder from "../components/DocBuilder";

type DocType = {
  id: string;
  createDoc: () => Promise<void>;
  title: string;
  src: string;
};

const Document = () => {
  const [docs, setDocs] = useState<DocType[]>([]);
  const navigate = useNavigate();

  const AllDocs = () => {
    return (
      <div className="flex flex-wrap gap-4 my-5">
        {docs.map(doc => {
          return (
            <DocBuilder
              key={doc.id}
              onClick={() => {
                navigate("/editor", { state: doc.id });
              }}
              title={doc.title}
              src={"src"}
            />
          );
        })}
      </div>
    );
  };

  async function createDoc() {
    // FIXME: post to get possible
    const docId = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/doc/create`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    navigate("/editor", { state: docId.data.id });
  }

  // useEffect(() => {
  //   console.log(docs);
  // }, [docs]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/doc/alldoc`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => setDocs(res.data));
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen px-6">
        <div className="w-full max-w-4xl px-6 py-6 flex flex-col items-start p-5 m-2">
          <div className="flex flex-col items-start gap-4 w-full self-start">
            <div className="text-lg font-medium">Start a new document</div>
            <div className="flex items-center gap-3 ">
              <DocBuilder onClick={createDoc} title={"Blank document"} src={"src"} />
            </div>
          </div>
          <hr className="my-6 w-full max-w-xl" />
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div>Recent documents</div>
              <div>owned by</div>
            </div>
            <div>{docs.length > 0 ? <AllDocs /> : <NoDocs />}</div>
          </div>
        </div>
      </div>
    </>
  );
};

const NoDocs = () => {
  return (
    <div>
      No text documents yet Select a blank document or choose another template above to get started
    </div>
  );
};

export default Document;
