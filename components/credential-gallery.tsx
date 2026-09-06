'use client';
import { useState, useRef, useEffect } from 'react';
import {
  ArrowUpRight,
  Award,
  Minus,
  Plus,
  RotateCcw,
  Scan,
} from 'lucide-react';
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
  const [failed, setFailed] = useState(false);
  const previewRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = previewRef.current;
    if (image?.complete && image.naturalWidth === 0) setFailed(true);
  }, [credential.image]);
  const card = (
    <>
      <div className="credential-top">
        <span className="mono">
          0{index + 1} / {credential.kind}
        </span>
        <Award size={20} />
      </div>
      <div className="credential-content">
        <p className="credential-issuer">{credential.issuer}</p>
        <h3>{credential.title}</h3>
      </div>
      {credential.image && !failed ? (
        <div className="credential-thumbnail">
          <img
            ref={previewRef}
            src={credential.image}
            alt={`${credential.title} certificate preview`}
            onError={() => setFailed(true)}
            loading="lazy"
          />
          <span>
            <Scan size={15} /> View credential
          </span>
        </div>
      ) : (
        <p className="credential-type">
          {credential.kind === 'Certification'
            ? 'CERTIFICATION'
            : 'VIRTUAL JOB SIMULATION'}
        </p>
      )}
      {credential.date && <p className="mono">{credential.date}</p>}
    </>
  );
  return (
    <article className="credential-card">
      {credential.image ? (
        <Dialog onOpenChange={() => setZoom(1)}>
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
            <div
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
                  src={credential.image}
                  alt={`${credential.title}, issued by ${credential.issuer}`}
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
