import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import DocBuilder from "../components/DocBuilder";
import Navbar from "../components/Navbar";
import { docAtom } from "../store/atom/docAtom";
import { userAtom } from "../store/atom/userAtom";

type DocType = {
  id: string;
  createDoc: () => Promise<void>;
  title: string;
  src: string;
};

const Document = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<DocType[]>([]);
  const setUserState = useSetRecoilState(userAtom);
  const docState = useSetRecoilState(docAtom);

  const AllDocs = () => {
    return (
      <div className="flex flex-wrap gap-4 my-5">
        {docs.map(doc => {
          return (
            <DocBuilder
              key={doc.id}
              onClick={() => {
                docState(doc);
                navigate("/editor");
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
    const doc = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/doc/create`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    docState(doc.data);
    navigate("/editor");
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

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getuser`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(res => setUserState(res.data));
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
