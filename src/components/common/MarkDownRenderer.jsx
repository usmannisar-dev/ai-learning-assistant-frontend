import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const MarkDownRenderer = ({ content = "" }) => {
  return (
    <div className="text-neutral-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h1
              className="mt-4 mb-2 text-xl font-bold text-slate-900"
              {...props}
            />
          ),

          h2: (props) => (
            <h2
              className="mt-4 mb-2 text-lg font-bold text-slate-900"
              {...props}
            />
          ),

          h3: (props) => (
            <h3
              className="mt-3 mb-2 text-base font-bold text-slate-900"
              {...props}
            />
          ),

          h4: (props) => (
            <h4
              className="mt-3 mb-1 text-sm font-bold text-slate-900"
              {...props}
            />
          ),

          p: (props) => (
            <p className="mb-2 leading-relaxed" {...props} />
          ),

          a: (props) => (
            <a
              className="text-emerald-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),

          ul: (props) => (
            <ul className="mb-2 ml-4 list-inside list-disc" {...props} />
          ),

          ol: (props) => (
            <ol className="mb-2 ml-4 list-inside list-decimal" {...props} />
          ),

          li: (props) => <li className="mb-1" {...props} />,

          strong: (props) => (
            <strong className="font-semibold text-slate-900" {...props} />
          ),

          em: (props) => <em className="italic" {...props} />,

          blockquote: (props) => (
            <blockquote
              className="my-4 border-l-4 border-slate-300 pl-4 italic text-slate-600"
              {...props}
            />
          ),

          code: ({ inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");

            if (!inline && match) {
              return (
                <SyntaxHighlighter
                  style={dracula}
                  language={match[1]}
                  PreTag="div"
                  className="my-4 overflow-x-auto rounded-xl"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }

            return (
              <code
                className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm text-slate-800"
                {...props}
              >
                {children}
              </code>
            );
          },

          pre: (props) => (
            <pre
              className="my-4 overflow-x-auto rounded-xl bg-neutral-800 p-3 font-mono text-sm text-white"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkDownRenderer;
