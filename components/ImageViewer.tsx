import Image from "next/image";

interface ImageViewerProps {
  src: string;
}

export const ImageViewer = ({ src }: ImageViewerProps): JSX.Element => {
  return (
    <div className="component">
      <div className="image-viewer">
        <div className="image-viewer-inner">
          {src ? (
            <Image
              src={src}
              alt="Selected image"
              width={960}
              height={500}
              className="image"
              priority={true}
            />
          ) : (
            <div className="placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="149"
                height="132"
                viewBox="0 0 149 132"
              >
                <path
                  d="M143.209,105.968c0,6.25-5.113,11.364-11.363,11.364H18.203c-6.25
0-11.363-5.113-11.363-11.364v-86.37c0-6.25,5.113-11.363
11.363-11.363h113.643c6.25,0,11.363,5.113,11.363,11.363V105.968z
M18.203,17.326c-1.207,0-2.271,1.068-2.271,2.271v86.37c0,1.207,1.065
2.271,2.271,2.271h113.643c1.203,0,2.274-1.064
2.274-2.271v-86.37c0-1.203-1.071-2.271-2.274-2.271H18.203z
M38.661,53.691c-7.529,0-13.641-6.108-13.641-13.635s6.112-13.638,13.641-13.638
c7.526,0,13.632,6.111,13.632,13.638S46.188,53.691,38.661,53.691z
M125.025,99.15H25.02V85.51l22.73-22.724l11.363,11.36l36.365-36.361l29.547,29.547V99.15z"
                />
              </svg>
              <h1>No Image</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
