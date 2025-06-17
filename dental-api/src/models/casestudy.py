from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from src.models import db # Import db from src.models (centralized instance)

class CaseStudy(db.Model):
    __tablename__ = 'case_studies'

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    summary = Column(Text, nullable=False)
    challenge = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    results = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    published_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'slug': self.slug,
            'summary': self.summary,
            'challenge': self.challenge,
            'solution': self.solution,
            'results': self.results,
            'image_url': self.image_url,
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def __repr__(self):
        return f'<CaseStudy {self.slug}>'
