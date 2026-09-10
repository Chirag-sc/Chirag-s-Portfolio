'use client';
import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Download, Minus, Plus, RotateCcw, Scan } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { credentials, type Credential } from '@/lib/portfolio-data';

export function CredentialCard({
  credential,
  index,
}: {
  credential: Credential;
  index: number;
}) {
  const [zoom, setZoom] = useState(1);
  const [pageIndex, setPageIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const previewRef = useRef<HTMLImageElement>(null);
  const imageScroll = useRef<HTMLDivElement>(null);
  const pages = credential.pages?.length ? credential.pages : credential.image ? [credential.image] : [];
  const changePage = (index: number) => {
    setPageIndex(index);
    setZoom(1);
    setFailed(false);
    imageScroll.current?.scrollTo({top: 0, left: 0, behavior: 'instant'});
  };
  useEffect(() => {
    const image = previewRef.current;
    if (image?.complete && image.naturalWidth === 0) setPreviewFailed(true);
  }, [credential.thumbnail, credential.image]);
  const card = (
    <>
      <span className="credential-index mono">
        {String(index + 1).padStart(2, '0')}
      </span>
      <p className="credential-issuer">{credential.issuer}</p>
      <div className="credential-content">
        <h3>{credential.title}</h3>
        {credential.date && (
          <p className="credential-date mono">{credential.date}</p>
        )}
      </div>
      <div className="credential-tail">
        <p className="credential-type">
          {credential.kind === 'Certification'
            ? 'Certification'
            : 'Virtual job simulation'}
        </p>
        {credential.image ? (
          <div className="credential-thumbnail">
            {!previewFailed && (
            <img
              ref={previewRef}
              src={credential.thumbnail ?? credential.image}
              alt={`${credential.title} certificate preview`}
              onError={() => setPreviewFailed(true)}
              loading="lazy"
            />
            )}
            <span>
              <Scan size={15} /> View credential
            </span>
          </div>
        ) : null}
      </div>
    </>
  );
  return (
    <article className="credential-card">
      {credential.image ? (
        <Dialog onOpenChange={() => changePage(0)}>
          <DialogTrigger className="credential-trigger">{card}</DialogTrigger>
          <DialogContent className="certificate-dialog">
            <DialogTitle>{credential.title}</DialogTitle>
            <DialogDescription>
              {credential.issuer} · {credential.kind}
            </DialogDescription>
            <div className="image-toolbar">
              <button
                aria-label="Zoom out"
                disabled={zoom <= 1}
                onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
              >
                <Minus size={18} />
              </button>
              <output aria-live="polite">{Math.round(zoom * 100)}%</output>
              <button
                aria-label="Zoom in"
                disabled={zoom >= 3}
                onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
              >
                <Plus size={18} />
              </button>
              <button aria-label="Reset zoom" onClick={() => setZoom(1)}>
                <RotateCcw size={17} />
              </button>
            </div>
            {(credential.pdf || pages.length > 1) && (
              <div className="certificate-document-actions">
                {pages.length > 1 && <div className="certificate-page-controls">
                  <button aria-label="Previous certificate page" disabled={pageIndex === 0} onClick={() => changePage(pageIndex - 1)}><ChevronLeft size={18} /></button>
                  <output aria-live="polite">Page {pageIndex + 1} of {pages.length}</output>
                  <button aria-label="Next certificate page" disabled={pageIndex === pages.length - 1} onClick={() => changePage(pageIndex + 1)}><ChevronRight size={18} /></button>
                </div>}
                {credential.pdf && <a className="certificate-download" href={credential.pdf} download><Download size={16} /> Download PDF</a>}
              </div>
            )}
            <div
              ref={imageScroll}
              className="certificate-image-scroll"
              tabIndex={0}
              aria-label="Certificate image, scroll to pan when zoomed"
            >
              {failed ? (
                <p role="status" className="image-error">
                  This image could not be loaded. The credential details remain
                  available above.
                </p>
              ) : (
                <img
                  className="certificate-full-image"
                  key={pages[pageIndex]}
                  src={pages[pageIndex]}
                  alt={`${credential.title}, ${credential.issuer}${pages.length > 1 ? `, page ${pageIndex + 1} of ${pages.length}` : ''}`}
                  style={{ width: `${zoom * 100}%`, maxWidth: 'none' }}
                  onError={() => setFailed(true)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="credential-text">{card}</div>
      )}
      {credential.verificationUrl && (
        <a
          className="verify-link"
          href={credential.verificationUrl}
          target="_blank"
          rel="noreferrer"
        >
          Verify credential <ArrowUpRight size={16} />
        </a>
      )}
    </article>
  );
}
export default function CredentialGallery() {
  return (
    <div className="credential-grid">
      {credentials.map((credential, index) => (
        <CredentialCard
          key={credential.id}
          credential={credential}
          index={index}
        />
      ))}
    </div>
  );
}
