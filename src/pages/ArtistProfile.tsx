import { useState } from "react";
import { artistData } from "../data/artistData";

export const ArtistProfile = () => {
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);

  const toggleAlbum = (id: string, hasTracks: boolean) => {
    if (!hasTracks) return;
    setOpenAlbumId(openAlbumId === id ? null : id);
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img
          src={artistData.imageUrl}
          alt={artistData.name}
          style={{ width: "150px", height: "150px", borderRadius: "50%" }}
        />
        <h2>{artistData.name}</h2>
        <h4>{artistData.differentName}</h4>
        <p>
          소속사 : {artistData.company} <br />
          데뷔일 : {artistData.debutDate}
        </p>
        <p>{artistData.genre}</p>
        <p style={{ color: "#555" }}>{artistData.bio}</p>
      </div>

      <h3>🎵 앨범</h3>
      <div
        style={{
          maxHeight: "600px",
          overflowY: "auto",
        }}
      >
        {artistData.albums.map((album) => {
          const hasTracks = album.tracks && album.tracks.length > 0;
          const isOpen = openAlbumId === album.id;

          return (
            <div
              key={album.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <div
                onClick={() => toggleAlbum(album.id, hasTracks)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: hasTracks ? "pointer" : "default",
                  padding: "0.5rem",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <img
                  src={album.coverUrl}
                  alt={album.title}
                  style={{ width: "60px", height: "60px", marginRight: "1rem" }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{album.title}</strong>
                  <p style={{ fontSize: "0.8rem", color: "#888" }}>
                    {new Date(album.releaseDate).toLocaleDateString()}
                  </p>
                </div>
                {/*  트랙 여부 아이콘 */}
                {hasTracks && (
                  <span style={{ fontSize: "1.2rem" }}>
                    {isOpen ? "▲" : "▼"}
                  </span>
                )}
              </div>

              {/* 트랙리스트 (트랙이 있을 때만 표시) */}
              {isOpen && hasTracks && (
                <div
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#fff",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {album.tracks.map((track, idx) => (
                    <p key={idx}>
                      {idx + 1}. {track.title} ({track.duration})
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
